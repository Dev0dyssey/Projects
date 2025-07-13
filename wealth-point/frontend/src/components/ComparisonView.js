import React, { useState } from 'react';
import ComparisonResults from './ComparisonResults';
import ChangeTrackingDashboard from './ChangeTrackingDashboard';

const ComparisonView = ({ onOptimize, optimizing, comparisonResults }) => {
  const [maxLocations, setMaxLocations] = useState(500);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleOptimize = (e) => {
    e.preventDefault();
    onOptimize(maxLocations);
  };

  const hasResults = comparisonResults.week1 && comparisonResults.week2;

  return (
    <div className="card">
      <h2>Week Comparison Optimization</h2>
      <p>Compare optimal business locations across both competitive weeks to track strategic changes.</p>
      
      <form onSubmit={handleOptimize}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>
            Maximum Locations (1-500):
          </label>
          <input
            type="number"
            min="1"
            max="500"
            value={maxLocations}
            onChange={(e) => setMaxLocations(Math.max(1, Math.min(500, parseInt(e.target.value) || 1)))}
            style={{
              padding: '8px 12px',
              border: '1px solid #ced4da',
              borderRadius: '4px',
              width: '150px'
            }}
            disabled={optimizing}
          />
          <small style={{ display: 'block', color: '#6c757d', marginTop: '5px' }}>
            Will optimize the same number of locations for both Week 1 and Week 2
          </small>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            style={{
              background: 'none',
              border: 'none',
              color: '#007bff',
              cursor: 'pointer',
              textDecoration: 'underline',
              fontSize: '14px'
            }}
          >
            {showAdvanced ? 'Hide' : 'Show'} Comparison Details
          </button>
        </div>

        {showAdvanced && (
          <div style={{
            background: '#f8f9fa',
            padding: '15px',
            borderRadius: '4px',
            marginBottom: '20px',
            fontSize: '14px'
          }}>
            <h4>Comparison Analysis Features</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <h5>Week 1 vs Week 2:</h5>
                <ul>
                  <li>Side-by-side location rankings</li>
                  <li>Population coverage comparison</li>
                  <li>Distance to competitor analysis</li>
                  <li>Strategic positioning changes</li>
                </ul>
              </div>
              <div>
                <h5>Change Tracking:</h5>
                <ul>
                  <li>Locations stable across both weeks</li>
                  <li>New opportunities in Week 2</li>
                  <li>Lost positions from Week 1</li>
                  <li>Ranking movement indicators</li>
                </ul>
              </div>
            </div>
            <p><strong>Algorithm:</strong> Same balanced approach (60% population, 40% distance) applied to both weeks</p>
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <button
            type="submit"
            className="btn"
            disabled={optimizing}
            style={{
              background: optimizing ? '#6c757d' : '#007bff',
              cursor: optimizing ? 'not-allowed' : 'pointer'
            }}
          >
            {optimizing ? 'Analyzing Both Weeks...' : 'Compare Both Weeks'}
          </button>
          
          {optimizing && (
            <div style={{ color: '#6c757d', fontSize: '14px' }}>
              Running simultaneous optimization for Week 1 and Week 2...
            </div>
          )}
        </div>
      </form>

      {!optimizing && !hasResults && (
        <div style={{
          marginTop: '20px',
          padding: '15px',
          background: '#fff3cd',
          color: '#856404',
          borderRadius: '4px',
          fontSize: '14px'
        }}>
          <h4>Ready for Comparison</h4>
          <p>
            Click "Compare Both Weeks" to run optimization analysis for both competitive scenarios.
            This will help you understand how competitor changes between weeks impact your optimal business locations.
          </p>
        </div>
      )}

      {hasResults && (
        <>
          <ComparisonResults 
            week1Results={comparisonResults.week1}
            week2Results={comparisonResults.week2}
            maxLocations={maxLocations}
          />
          
          <ChangeTrackingDashboard 
            comparisonResults={comparisonResults}
          />
        </>
      )}
    </div>
  );
};

export default ComparisonView;
