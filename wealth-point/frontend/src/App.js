import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DataSummary from './components/DataSummary';
import WeekToggle from './components/WeekToggle';
import CompetitorTable from './components/CompetitorTable';
import OptimizationPanel from './components/OptimizationPanel';
import OptimizationResults from './components/OptimizationResults';
import ModeToggle from './components/ModeToggle';
import ComparisonView from './components/ComparisonView';
import StrategyManager from './components/StrategyManager';
import SenseCheckingTools from './components/SenseCheckingTools';

function App() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dataSummary, setDataSummary] = useState(null);
  const [currentWeek, setCurrentWeek] = useState('week1');
  const [competitors, setCompetitors] = useState({ week1: [], week2: [] });
  const [optimizationResults, setOptimizationResults] = useState(null);
  const [optimizing, setOptimizing] = useState(false);
  const [comparisonMode, setComparisonMode] = useState(false);
  const [comparisonResults, setComparisonResults] = useState({ week1: null, week2: null });
  const [comparingBoth, setComparingBoth] = useState(false);


  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      setError(null);


      const healthCheck = await axios.get('/api/health');
      if (!healthCheck.data.dataLoaded) {
        throw new Error('Backend data not loaded yet. Please wait...');
      }


      const summaryResponse = await axios.get('/api/data/summary');
      setDataSummary(summaryResponse.data);


      const [week1Response, week2Response] = await Promise.all([
        axios.get('/api/data/competitors/week1'),
        axios.get('/api/data/competitors/week2')
      ]);

      setCompetitors({
        week1: week1Response.data,
        week2: week2Response.data
      });

    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOptimize = async (maxLocations = 500) => {
    if (comparisonMode) {
      return handleComparisonOptimize(maxLocations);
    }

    try {
      setOptimizing(true);
      setError(null);

      const response = await axios.post('/api/optimize', {
        week: currentWeek,
        maxLocations: parseInt(maxLocations)
      });

      setOptimizationResults(response.data);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setOptimizing(false);
    }
  };

  const handleComparisonOptimize = async (maxLocations = 500) => {
    try {
      setComparingBoth(true);
      setError(null);

      console.log(`Starting efficient comparison optimization for ${maxLocations} locations`);
      

      const response = await axios.post('/api/compare-optimizations', {
        maxLocations: parseInt(maxLocations),
        includeDetails: true
      });


      const { week1Results, week2Results } = response.data;
      
      setComparisonResults({
        week1: {
          totalSelected: week1Results.totalSelected,
          summary: week1Results.summary,
          locations: week1Results.locations
        },
        week2: {
          totalSelected: week2Results.totalSelected,
          summary: week2Results.summary,
          locations: week2Results.locations
        },

        comparisonAnalysis: response.data.comparisonAnalysis,
        locationStats: response.data.locationStats,
        locationComparison: response.data.locationComparison,
        timestamp: response.data.timestamp
      });
      
      console.log(`Comparison completed successfully:`, {
        week1Locations: week1Results.totalSelected,
        week2Locations: week2Results.totalSelected,
        stableLocations: response.data.locationStats.stableLocations,
        newLocations: response.data.locationStats.newLocations,
        lostLocations: response.data.locationStats.lostLocations
      });
      
    } catch (err) {
      console.error('Comparison optimization error:', err);
      setError(err.response?.data?.error || err.message);
    } finally {
      setComparingBoth(false);
    }
  };

  const handleWeekChange = (week) => {
    setCurrentWeek(week);
    setOptimizationResults(null);
  };

  const handleModeChange = (isComparison) => {
    setComparisonMode(isComparison);

    setOptimizationResults(null);
    setComparisonResults({ week1: null, week2: null });
  };

  const handleLoadStrategy = (strategy) => {
    try {

      setComparisonMode(strategy.mode === 'comparison');
      
      if (strategy.mode === 'comparison') {

        setComparisonResults(strategy.data);
        setOptimizationResults(null);
      } else {

        const weekData = strategy.data[strategy.week];
        setOptimizationResults(weekData);
        setCurrentWeek(strategy.week);
        setComparisonResults({ week1: null, week2: null });
      }
      
      alert(`Strategy "${strategy.name}" loaded successfully!`);
    } catch (error) {
      console.error('Error loading strategy:', error);
      alert('Error loading strategy. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">
          <h2>Loading Data...</h2>
          <p>Please wait while we load the population and competitor data.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="header">
        <h1>Wealth Point - Business Location Optimizer</h1>
        <p>Optimize your business locations to maximize customer capture while staying competitive.</p>
      </div>

      {error && (
        <div className="error">
          <strong>Error:</strong> {error}
          <button 
            className="btn" 
            style={{ marginLeft: '10px' }}
            onClick={loadInitialData}
          >
            Retry
          </button>
        </div>
      )}

      {dataSummary && (
        <DataSummary data={dataSummary} />
      )}

      <div className="card">
        <h2>Competition Analysis</h2>
        <WeekToggle 
          currentWeek={currentWeek} 
          onWeekChange={handleWeekChange} 
        />
        
        <CompetitorTable 
          competitors={competitors[currentWeek]} 
          week={currentWeek}
        />
      </div>

      <ModeToggle 
        comparisonMode={comparisonMode}
        onModeChange={handleModeChange}
      />

      {!comparisonMode ? (
        <>
          <OptimizationPanel 
            onOptimize={handleOptimize}
            optimizing={optimizing}
            currentWeek={currentWeek}
          />

          {optimizationResults && (
            <OptimizationResults 
              results={optimizationResults}
              week={currentWeek}
            />
          )}
        </>
      ) : (
        <ComparisonView
          onOptimize={handleOptimize}
          optimizing={comparingBoth}
          comparisonResults={comparisonResults}
        />
      )}

      {/* Advanced Sense-Checking Tools */}
      {(optimizationResults || (comparisonResults.week1 && comparisonResults.week2)) && (
        <SenseCheckingTools
          optimizationResults={optimizationResults}
          comparisonResults={comparisonResults}
          comparisonMode={comparisonMode}
        />
      )}

      <StrategyManager
        optimizationResults={optimizationResults}
        comparisonResults={comparisonResults}
        currentWeek={currentWeek}
        comparisonMode={comparisonMode}
        onLoadStrategy={handleLoadStrategy}
      />
    </div>
  );
}

export default App;
