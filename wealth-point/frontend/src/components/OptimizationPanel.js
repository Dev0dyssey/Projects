import React, { useState } from 'react';

const OptimizationPanel = ({ onOptimize, optimizing, currentWeek }) => {
  const [maxLocations, setMaxLocations] = useState(500);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleOptimize = (e) => {
    e.preventDefault();
    onOptimize(maxLocations);
  };

  return (
    <div className="card">
      <h2>Location Optimization</h2>
      <p>Find the optimal business locations to maximize customer capture while maintaining distance from competitors.</p>
      
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
            Each location will be placed at an Output Area (OA) centroid
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
            {showAdvanced ? 'Hide' : 'Show'} Algorithm Details
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
            <h4>Optimization Algorithm Details</h4>
            <ul style={{ marginBottom: '10px' }}>
              <li><strong>Population Weight:</strong> 60% - Prioritizes areas with higher population density</li>
              <li><strong>Distance Weight:</strong> 40% - Maintains distance from competitor locations</li>
              <li><strong>Geographic Clustering:</strong> Prevents over-concentration in single areas</li>
              <li><strong>Minimum Distance:</strong> 2km between your business locations</li>
            </ul>
            <p><strong>Current Analysis:</strong> {currentWeek.toUpperCase()} competitor data</p>
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
            {optimizing ? 'Optimizing...' : `Optimize for ${currentWeek.toUpperCase()}`}
          </button>
          
          {optimizing && (
            <div style={{ color: '#6c757d', fontSize: '14px' }}>
              Analyzing {maxLocations} optimal locations...
            </div>
          )}
        </div>
      </form>

      <div style={{
        marginTop: '20px',
        padding: '15px',
        background: '#e7f3ff',
        borderRadius: '4px',
        fontSize: '14px'
      }}>
        <h4>Strategy Notes</h4>
        <p>
          The optimization algorithm balances customer accessibility with competitive positioning. 
          Higher population areas are prioritized, but locations too close to competitors receive lower scores.
          This ensures maximum market capture while maintaining strategic advantage.
        </p>
      </div>
    </div>
  );
};

export default OptimizationPanel;
