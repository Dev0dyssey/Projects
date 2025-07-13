const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

class DataService {
  constructor() {
    this.dataPath = path.join(__dirname, '../../');
  }

  async loadCSV(filename) {
    return new Promise((resolve, reject) => {
      const results = [];
      const filePath = path.join(this.dataPath, filename);
      
      if (!fs.existsSync(filePath)) {
        reject(new Error(`File not found: ${filePath}`));
        return;
      }

      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => {
          console.log(`Loaded ${results.length} records from ${filename}`);
          resolve(results);
        })
        .on('error', (error) => {
          reject(error);
        });
    });
  }

  async loadPopulationData() {
    try {
      const rawData = await this.loadCSV('population_v2.csv');
      

      return rawData.map((row, index) => {
        const lat = parseFloat(row.latitude || row.lat);
        const lng = parseFloat(row.longitude || row.lng || row.long);
        const population = parseInt(row.Population || row.population || 0);
        const oa = row.OA || row.oa || row.OA_code || `OA_${index}`;
        
        if (isNaN(lat) || isNaN(lng)) {
          console.warn(`Invalid coordinates in population data at row ${index}`);
          return null;
        }
        
        return {
          oa,
          latitude: lat,
          longitude: lng,
          population: population || 0,
          id: index
        };
      }).filter(row => row !== null);
    } catch (error) {
      console.error('Error loading population data:', error);
      throw error;
    }
  }

  async loadCompetitorData(week) {
    try {
      const filename = `${week}.csv`;
      const rawData = await this.loadCSV(filename);
      

      return rawData.map((row, index) => {
        const lat = parseFloat(row.latitude || row.lat);
        const lng = parseFloat(row.longitude || row.lng || row.long);
        
        if (isNaN(lat) || isNaN(lng)) {
          console.warn(`Invalid coordinates in ${filename} at row ${index}`);
          return null;
        }
        
        return {
          id: row[''] || row.index || index,
          latitude: lat,
          longitude: lng
        };
      }).filter(row => row !== null);
    } catch (error) {
      console.error(`Error loading ${week} competitor data:`, error);
      throw error;
    }
  }

  async loadAllData() {
    try {
      console.log('Starting data load process...');
      
      const [population, week1Competitors, week2Competitors] = await Promise.all([
        this.loadPopulationData(),
        this.loadCompetitorData('week1'),
        this.loadCompetitorData('week2')
      ]);


      if (population.length === 0) {
        throw new Error('No population data loaded');
      }
      
      if (week1Competitors.length === 0 || week2Competitors.length === 0) {
        throw new Error('No competitor data loaded');
      }

      console.log('Data validation completed successfully');
      
      return {
        population,
        competitors: {
          week1: week1Competitors,
          week2: week2Competitors
        },
        loadedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Failed to load all data:', error);
      throw error;
    }
  }


  getDataSummary(data) {
    if (!data) {
      return null;
    }
    
    const totalPopulation = data.population.reduce((sum, area) => sum + area.population, 0);
    const avgPopulation = totalPopulation / data.population.length;
    

    const lats = data.population.map(p => p.latitude);
    const lngs = data.population.map(p => p.longitude);
    
    return {
      populationAreas: data.population.length,
      totalPopulation,
      averagePopulation: Math.round(avgPopulation),
      week1Competitors: data.competitors.week1.length,
      week2Competitors: data.competitors.week2.length,
      geographicBounds: {
        north: Math.max(...lats),
        south: Math.min(...lats),
        east: Math.max(...lngs),
        west: Math.min(...lngs)
      },
      loadedAt: data.loadedAt
    };
  }
}

module.exports = new DataService();
