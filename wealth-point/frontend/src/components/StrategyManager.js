import React, { useState, useEffect } from 'react';

const StrategyManager = ({ 
  optimizationResults, 
  comparisonResults, 
  currentWeek, 
  comparisonMode,
  onLoadStrategy 
}) => {
  const [savedStrategies, setSavedStrategies] = useState([]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showLoadDialog, setShowLoadDialog] = useState(false);
  const [strategyName, setStrategyName] = useState('');
  const [strategyDescription, setStrategyDescription] = useState('');
  const [selectedStrategy, setSelectedStrategy] = useState(null);


  useEffect(() => {
    loadSavedStrategies();
  }, []);

  const loadSavedStrategies = () => {
    try {
      const saved = localStorage.getItem('wealthpoint_strategies');
      if (saved) {
        const strategies = JSON.parse(saved);
        setSavedStrategies(strategies);
      }
    } catch (error) {
      console.error('Error loading saved strategies:', error);
    }
  };

  const saveStrategy = () => {
    if (!strategyName.trim()) {
      alert('Please enter a strategy name');
      return;
    }

    const hasResults = comparisonMode ? 
      (comparisonResults.week1 && comparisonResults.week2) : 
      optimizationResults;

    if (!hasResults) {
      alert('No optimization results to save');
      return;
    }

    const strategy = {
      id: Date.now().toString(),
      name: strategyName.trim(),
      description: strategyDescription.trim(),
      mode: comparisonMode ? 'comparison' : 'single',
      week: comparisonMode ? 'both' : currentWeek,
      timestamp: new Date().toISOString(),
      maxLocations: comparisonMode ? 
        comparisonResults.week1?.totalSelected || comparisonResults.week2?.totalSelected :
        optimizationResults?.totalSelected,
      data: comparisonMode ? {
        week1: comparisonResults.week1,
        week2: comparisonResults.week2
      } : {
        [currentWeek]: optimizationResults
      }
    };

    try {
      const updatedStrategies = [...savedStrategies, strategy];
      localStorage.setItem('wealthpoint_strategies', JSON.stringify(updatedStrategies));
      setSavedStrategies(updatedStrategies);
      

      setStrategyName('');
      setStrategyDescription('');
      setShowSaveDialog(false);
      
      alert('Strategy saved successfully!');
    } catch (error) {
      console.error('Error saving strategy:', error);
      alert('Error saving strategy. Please try again.');
    }
  };

  const loadStrategy = (strategy) => {
    if (onLoadStrategy) {
      onLoadStrategy(strategy);
    }
    setShowLoadDialog(false);
    setSelectedStrategy(null);
  };

  const deleteStrategy = (strategyId) => {
    if (window.confirm('Are you sure you want to delete this strategy?')) {
      try {
        const updatedStrategies = savedStrategies.filter(s => s.id !== strategyId);
        localStorage.setItem('wealthpoint_strategies', JSON.stringify(updatedStrategies));
        setSavedStrategies(updatedStrategies);
      } catch (error) {
        console.error('Error deleting strategy:', error);
        alert('Error deleting strategy. Please try again.');
      }
    }
  };

  const exportStrategy = (strategy) => {
    try {
      const exportData = {
        ...strategy,
        exportedAt: new Date().toISOString(),
        version: '1.0'
      };
      
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `strategy_${strategy.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`;
      link.click();
      
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting strategy:', error);
      alert('Error exporting strategy. Please try again.');
    }
  };

  const hasResultsToSave = comparisonMode ? 
    (comparisonResults.week1 && comparisonResults.week2) : 
    optimizationResults;

  const formatDate = (isoString) => {
    return new Date(isoString).toLocaleString();
  };

  const getModeLabel = (mode) => {
    return mode === 'comparison' ? 'Week Comparison' : 'Single Week';
  };

  const getWeekLabel = (week) => {
    if (week === 'both') return 'Week 1 & 2';
    return week === 'week1' ? 'Week 1' : 'Week 2';
  };

  return (
    <div className="card">
      <h2>Strategy Management</h2>
      <p>Save and load optimization scenarios for future reference and comparison.</p>

      {/* Action Buttons */}
      <div style={{ 
        display: 'flex', 
        gap: '10px', 
        marginBottom: '20px',
        flexWrap: 'wrap'
      }}>
        <button
          className="btn"
          onClick={() => setShowSaveDialog(true)}
          disabled={!hasResultsToSave}
          style={{
            background: hasResultsToSave ? '#28a745' : '#6c757d',
            cursor: hasResultsToSave ? 'pointer' : 'not-allowed'
          }}
        >
          💾 Save Current Strategy
        </button>
        
        <button
          className="btn secondary"
          onClick={() => setShowLoadDialog(true)}
          disabled={savedStrategies.length === 0}
          style={{
            cursor: savedStrategies.length > 0 ? 'pointer' : 'not-allowed'
          }}
        >
          📁 Load Strategy ({savedStrategies.length})
        </button>
      </div>

      {!hasResultsToSave && (
        <div style={{
          background: '#fff3cd',
          color: '#856404',
          padding: '15px',
          borderRadius: '4px',
          marginBottom: '20px'
        }}>
          <h4>No Results to Save</h4>
          <p>Run an optimization first to save your strategy results.</p>
        </div>
      )}

      {/* Recent Strategies Preview */}
      {savedStrategies.length > 0 && (
        <div style={{
          background: '#f8f9fa',
          padding: '15px',
          borderRadius: '4px'
        }}>
          <h4>Recent Strategies</h4>
          <div style={{ fontSize: '14px' }}>
            {savedStrategies.slice(-3).reverse().map((strategy) => (
              <div key={strategy.id} style={{
                padding: '8px',
                background: 'white',
                marginBottom: '8px',
                borderRadius: '4px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <strong>{strategy.name}</strong>
                  <br />
                  <small style={{ color: '#6c757d' }}>
                    {getModeLabel(strategy.mode)} • {getWeekLabel(strategy.week)} • {formatDate(strategy.timestamp)}
                  </small>
                </div>
                <button
                  className="btn secondary"
                  style={{ fontSize: '12px', padding: '4px 8px' }}
                  onClick={() => loadStrategy(strategy)}
                >
                  Load
                </button>
              </div>
            ))}
            {savedStrategies.length > 3 && (
              <p style={{ color: '#6c757d', fontStyle: 'italic' }}>
                +{savedStrategies.length - 3} more strategies
              </p>
            )}
          </div>
        </div>
      )}

      {/* Save Dialog */}
      {showSaveDialog && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            padding: '30px',
            borderRadius: '8px',
            width: '500px',
            maxWidth: '90vw'
          }}>
            <h3>Save Strategy</h3>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>
                Strategy Name *
              </label>
              <input
                type="text"
                value={strategyName}
                onChange={(e) => setStrategyName(e.target.value)}
                placeholder="e.g., High Population Focus Q1 2024"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #ced4da',
                  borderRadius: '4px'
                }}
                maxLength={100}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>
                Description (Optional)
              </label>
              <textarea
                value={strategyDescription}
                onChange={(e) => setStrategyDescription(e.target.value)}
                placeholder="Describe the strategy, assumptions, or notes..."
                rows={3}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #ced4da',
                  borderRadius: '4px',
                  resize: 'vertical'
                }}
                maxLength={500}
              />
            </div>

            <div style={{
              background: '#f8f9fa',
              padding: '15px',
              borderRadius: '4px',
              marginBottom: '20px',
              fontSize: '14px'
            }}>
              <h4>Strategy Details</h4>
              <p><strong>Mode:</strong> {getModeLabel(comparisonMode ? 'comparison' : 'single')}</p>
              <p><strong>Week(s):</strong> {getWeekLabel(comparisonMode ? 'both' : currentWeek)}</p>
              <p><strong>Max Locations:</strong> {
                comparisonMode ? 
                  (comparisonResults.week1?.totalSelected || comparisonResults.week2?.totalSelected) :
                  optimizationResults?.totalSelected
              }</p>
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                className="btn secondary"
                onClick={() => {
                  setShowSaveDialog(false);
                  setStrategyName('');
                  setStrategyDescription('');
                }}
              >
                Cancel
              </button>
              <button
                className="btn"
                onClick={saveStrategy}
                style={{ background: '#28a745' }}
              >
                Save Strategy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Load Dialog */}
      {showLoadDialog && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            padding: '30px',
            borderRadius: '8px',
            width: '700px',
            maxWidth: '90vw',
            maxHeight: '80vh',
            overflow: 'auto'
          }}>
            <h3>Load Strategy</h3>
            <p>Select a saved strategy to load its optimization results.</p>
            
            {savedStrategies.length === 0 ? (
              <p style={{ fontStyle: 'italic', color: '#6c757d' }}>No saved strategies found.</p>
            ) : (
              <div style={{ marginBottom: '20px' }}>
                {savedStrategies.slice().reverse().map((strategy) => (
                  <div key={strategy.id} style={{
                    border: '1px solid #dee2e6',
                    borderRadius: '4px',
                    padding: '15px',
                    marginBottom: '10px',
                    background: selectedStrategy?.id === strategy.id ? '#e7f3ff' : 'white'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ margin: '0 0 5px 0' }}>{strategy.name}</h4>
                        {strategy.description && (
                          <p style={{ margin: '0 0 10px 0', color: '#6c757d', fontSize: '14px' }}>
                            {strategy.description}
                          </p>
                        )}
                        <div style={{ fontSize: '14px', color: '#6c757d' }}>
                          <span>📊 {getModeLabel(strategy.mode)}</span>
                          <span style={{ margin: '0 10px' }}>•</span>
                          <span>📅 {getWeekLabel(strategy.week)}</span>
                          <span style={{ margin: '0 10px' }}>•</span>
                          <span>📍 {strategy.maxLocations} locations</span>
                          <span style={{ margin: '0 10px' }}>•</span>
                          <span>🕒 {formatDate(strategy.timestamp)}</span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '5px', marginLeft: '15px' }}>
                        <button
                          className="btn"
                          style={{ fontSize: '12px', padding: '4px 8px' }}
                          onClick={() => loadStrategy(strategy)}
                        >
                          Load
                        </button>
                        <button
                          className="btn secondary"
                          style={{ fontSize: '12px', padding: '4px 8px' }}
                          onClick={() => exportStrategy(strategy)}
                        >
                          Export
                        </button>
                        <button
                          className="btn"
                          style={{ 
                            fontSize: '12px', 
                            padding: '4px 8px',
                            background: '#dc3545'
                          }}
                          onClick={() => deleteStrategy(strategy.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                className="btn secondary"
                onClick={() => setShowLoadDialog(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StrategyManager;
