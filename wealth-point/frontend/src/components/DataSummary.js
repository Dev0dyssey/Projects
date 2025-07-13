import React from 'react';

const DataSummary = ({ data }) => {
  if (!data) return null;

  return (
    <div className="card">
      <h2>Data Overview</h2>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{data.populationAreas.toLocaleString()}</div>
          <div className="stat-label">Population Areas</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{data.totalPopulation.toLocaleString()}</div>
          <div className="stat-label">Total Population</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{data.week1Competitors.toLocaleString()}</div>
          <div className="stat-label">Week 1 Competitors</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{data.week2Competitors.toLocaleString()}</div>
          <div className="stat-label">Week 2 Competitors</div>
        </div>
      </div>
      
      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
        <h4>Competition Change Analysis</h4>
        <p>
          <strong>Net Change:</strong> {data.week2Competitors - data.week1Competitors > 0 ? '+' : ''}
          {(data.week2Competitors - data.week1Competitors).toLocaleString()} competitors 
          ({((data.week2Competitors - data.week1Competitors) / data.week1Competitors * 100).toFixed(1)}%)
        </p>
        <p>
          <strong>Market Impact:</strong> {
            data.week2Competitors > data.week1Competitors 
              ? 'Increased competition - more aggressive positioning needed'
              : data.week2Competitors < data.week1Competitors
                ? 'Decreased competition - opportunity for expansion'
                : 'Stable competition - maintain current strategy'
          }
        </p>
      </div>
    </div>
  );
};

export default DataSummary;
