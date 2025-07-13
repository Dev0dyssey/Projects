const express = require('express');
const cors = require('cors');
const path = require('path');
const dataService = require('./services/dataService');
const optimizationService = require('./services/optimizationService');

const app = express();
const PORT = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());


let appData = null;

async function initializeData() {
  try {
    console.log('Loading data...');
    appData = await dataService.loadAllData();
    console.log(`Loaded ${appData.population.length} population areas`);
    console.log(`Loaded ${appData.competitors.week1.length} week1 competitors`);
    console.log(`Loaded ${appData.competitors.week2.length} week2 competitors`);
  } catch (error) {
    console.error('Error loading data:', error);
  }
}


app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', dataLoaded: !!appData });
});

app.get('/api/data/population', (req, res) => {
  if (!appData) {
    return res.status(503).json({ error: 'Data not loaded yet' });
  }
  res.json(appData.population);
});

app.get('/api/data/competitors/:week', (req, res) => {
  if (!appData) {
    return res.status(503).json({ error: 'Data not loaded yet' });
  }
  
  const week = req.params.week;
  if (week !== 'week1' && week !== 'week2') {
    return res.status(400).json({ error: 'Invalid week parameter. Use week1 or week2' });
  }
  
  res.json(appData.competitors[week]);
});

app.get('/api/data/summary', (req, res) => {
  if (!appData) {
    return res.status(503).json({ error: 'Data not loaded yet' });
  }
  
  res.json({
    populationAreas: appData.population.length,
    week1Competitors: appData.competitors.week1.length,
    week2Competitors: appData.competitors.week2.length,
    totalPopulation: appData.population.reduce((sum, area) => sum + area.population, 0)
  });
});

app.post('/api/optimize', (req, res) => {
  if (!appData) {
    return res.status(503).json({ error: 'Data not loaded yet' });
  }
  
  const { week, maxLocations = 500 } = req.body;
  
  if (week !== 'week1' && week !== 'week2') {
    return res.status(400).json({ error: 'Invalid week parameter. Use week1 or week2' });
  }
  
  try {
    const recommendations = optimizationService.optimizeLocations(
      appData.population,
      appData.competitors[week],
      maxLocations
    );
    
    res.json(recommendations);
  } catch (error) {
    console.error('Optimization error:', error);
    res.status(500).json({ error: 'Optimization failed' });
  }
});


app.post('/api/compare-optimizations', (req, res) => {
  if (!appData) {
    return res.status(503).json({ error: 'Data not loaded yet' });
  }
  
  const { maxLocations = 500, includeDetails = false } = req.body;
  
  try {
    console.log(`Starting comparison optimization for ${maxLocations} locations`);
    console.log(`Week 1 competitors: ${appData.competitors.week1.length}`);
    console.log(`Week 2 competitors: ${appData.competitors.week2.length}`);
    console.log(`Population areas: ${appData.population.length}`);
    

    const week1Results = optimizationService.optimizeLocations(
      appData.population,
      appData.competitors.week1,
      maxLocations
    );
    
    const week2Results = optimizationService.optimizeLocations(
      appData.population,
      appData.competitors.week2,
      maxLocations
    );
    

    const comparisonAnalysis = optimizationService.compareOptimizations(week1Results, week2Results);
    

    const week1Locations = week1Results.locations.map((loc, index) => ({
      ...loc,
      week1Rank: index + 1
    }));
    
    const week2Locations = week2Results.locations.map((loc, index) => ({
      ...loc,
      week2Rank: index + 1
    }));
    

    const allOAs = new Set([
      ...week1Locations.map(loc => loc.oa),
      ...week2Locations.map(loc => loc.oa)
    ]);
    
    const locationComparison = Array.from(allOAs).map(oa => {
      const week1Data = week1Locations.find(loc => loc.oa === oa);
      const week2Data = week2Locations.find(loc => loc.oa === oa);
      
      return {
        oa,
        inBothWeeks: !!(week1Data && week2Data),
        week1Rank: week1Data?.week1Rank || null,
        week1Score: week1Data?.totalScore || null,
        week2Rank: week2Data?.week2Rank || null,
        week2Score: week2Data?.totalScore || null,
        rankChange: (week1Data && week2Data) ? week2Data.week2Rank - week1Data.week1Rank : null,
        changeType: week1Data && week2Data ? 'stable' : (week1Data ? 'lost' : 'new')
      };
    });
    

    const stableLocations = locationComparison.filter(loc => loc.changeType === 'stable').length;
    const newLocations = locationComparison.filter(loc => loc.changeType === 'new').length;
    const lostLocations = locationComparison.filter(loc => loc.changeType === 'lost').length;
    
    const response = {
      timestamp: new Date().toISOString(),
      maxLocations,
      week1Results: {
        totalSelected: week1Results.totalSelected,
        summary: week1Results.summary
      },
      week2Results: {
        totalSelected: week2Results.totalSelected,
        summary: week2Results.summary
      },
      comparisonAnalysis,
      locationStats: {
        totalUniqueLocations: allOAs.size,
        stableLocations,
        newLocations,
        lostLocations,
        stabilityRate: (stableLocations / Math.max(week1Results.totalSelected, week2Results.totalSelected)).toFixed(3)
      }
    };
    

    if (includeDetails) {
      response.week1Results.locations = week1Locations;
      response.week2Results.locations = week2Locations;
      response.locationComparison = locationComparison;
    }
    
    console.log(`Comparison completed: ${stableLocations} stable, ${newLocations} new, ${lostLocations} lost`);
    res.json(response);
    
  } catch (error) {
    console.error('Comparison optimization error:', error);
    res.status(500).json({ error: 'Comparison optimization failed' });
  }
});


app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await initializeData();
});
