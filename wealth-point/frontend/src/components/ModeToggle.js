import React from 'react';

const ModeToggle = ({ comparisonMode, onModeChange }) => {
  return (
    <div className="card">
      <h2>Analysis Mode</h2>
      <p>Choose how you want to analyze your business location optimization:</p>
      
      <div className="toggle-group" style={{ marginBottom: '20px' }}>
        <button 
          className={`toggle-btn ${!comparisonMode ? 'active' : ''}`}
          onClick={() => onModeChange(false)}
        >
          Single Week Analysis
        </button>
        <button 
          className={`toggle-btn ${comparisonMode ? 'active' : ''}`}
          onClick={() => onModeChange(true)}
        >
          Compare Both Weeks
        </button>
      </div>

      <div style={{
        background: comparisonMode ? '#e7f3ff' : '#f8f9fa',
        padding: '15px',
        borderRadius: '4px',
        fontSize: '14px'
      }}>
        {!comparisonMode ? (
          <div>
            <h4>Single Week Mode</h4>
            <p>
              Analyze and optimize locations for one week at a time. 
              Use the week toggle to switch between Week 1 and Week 2 competitor data.
              Perfect for focused analysis of specific competitive scenarios.
            </p>
          </div>
        ) : (
          <div>
            <h4>Comparison Mode</h4>
            <p>
              <strong>Side-by-side analysis</strong> of optimal locations for both weeks simultaneously.
              See how competitor changes between weeks impact your optimal positioning.
              Ideal for tracking strategy changes and identifying location stability.
            </p>
            <ul style={{ marginTop: '10px', paddingLeft: '20px' }}>
              <li>Runs optimization for both weeks with the same parameters</li>
              <li>Highlights locations that appear in both weeks vs. week-specific opportunities</li>
              <li>Shows ranking changes and strategic implications</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModeToggle;
