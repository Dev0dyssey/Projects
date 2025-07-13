import React, { useState, useMemo } from 'react';

const OptimizationResults = ({ results, week }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [sortField, setSortField] = useState('totalScore');
  const [sortDirection, setSortDirection] = useState('desc');

  const sortedLocations = useMemo(() => {
    if (!results?.locations) return [];
    
    return [...results.locations].sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];
      
      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }
      
      if (sortDirection === 'asc') {
        return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      } else {
        return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
      }
    });
  }, [results?.locations, sortField, sortDirection]);

  const paginatedLocations = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return sortedLocations.slice(startIndex, startIndex + pageSize);
  }, [sortedLocations, currentPage, pageSize]);

  const totalPages = Math.ceil(sortedLocations.length / pageSize);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(Math.max(1, Math.min(newPage, totalPages)));
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return ' ↕️';
    return sortDirection === 'asc' ? ' ↑' : ' ↓';
  };

  if (!results) return null;

  const { summary, optimization } = results;

  return (
    <div className="card">
      <h2>Optimization Results - {week.toUpperCase()}</h2>
      
      {/* Summary Statistics */}
      <div className="stats-grid" style={{ marginBottom: '20px' }}>
        <div className="stat-card">
          <div className="stat-value">{results.totalSelected}</div>
          <div className="stat-label">Locations Selected</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{summary.totalPopulationCovered?.toLocaleString()}</div>
          <div className="stat-label">Population Covered</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{summary.averageDistanceToNearestCompetitor}km</div>
          <div className="stat-label">Avg Distance to Competitor</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{summary.averageOptimizationScore}</div>
          <div className="stat-label">Avg Optimization Score</div>
        </div>
      </div>

      {/* Performance Analysis */}
      <div style={{
        background: '#f8f9fa',
        padding: '15px',
        borderRadius: '4px',
        marginBottom: '20px'
      }}>
        <h4>Performance Analysis</h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', fontSize: '14px' }}>
          <div>
            <p><strong>Market Coverage:</strong></p>
            <ul>
              <li>Total Population: {summary.totalPopulationCovered?.toLocaleString()}</li>
              <li>Average per Location: {summary.averagePopulationPerLocation?.toLocaleString()}</li>
              <li>Geographic Spread: {summary.geographicSpread?.coverage} degrees²</li>
            </ul>
          </div>
          <div>
            <p><strong>Competitive Position:</strong></p>
            <ul>
              <li>Min Distance to Competitor: {summary.minimumDistanceToCompetitor}km</li>
              <li>Strategic Buffer: {summary.minimumDistanceToCompetitor > 5 ? 'Excellent' : 
                                    summary.minimumDistanceToCompetitor > 2 ? 'Good' : 'Competitive'}</li>
              <li>Algorithm: {optimization.algorithm}</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Export/Action Buttons */}
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <button 
          className="btn"
          onClick={() => {
            const csvContent = [
              ['Rank', 'OA', 'Latitude', 'Longitude', 'Population', 'Score', 'Distance to Competitor'],
              ...sortedLocations.map((loc, index) => [
                index + 1,
                loc.oa,
                loc.latitude,
                loc.longitude,
                loc.population,
                loc.totalScore.toFixed(2),
                loc.distanceScore.toFixed(2)
              ])
            ].map(row => row.join(',')).join('\n');
            
            const blob = new Blob([csvContent], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `optimization_results_${week}.csv`;
            a.click();
            window.URL.revokeObjectURL(url);
          }}
        >
          Export to CSV
        </button>
        <button className="btn secondary">
          Save Strategy
        </button>
      </div>

      {/* Results Table */}
      <div style={{ marginBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3>Recommended Locations</h3>
        <div>
          <label style={{ marginRight: '10px' }}>
            Page size: 
            <select 
              value={pageSize} 
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              style={{ marginLeft: '5px', padding: '4px' }}
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </label>
        </div>
      </div>

      <div style={{ overflowX: 'auto', maxHeight: '500px', border: '1px solid #dee2e6' }}>
        <table className="table">
          <thead>
            <tr>
              <th>Rank</th>
              <th onClick={() => handleSort('oa')} style={{ cursor: 'pointer' }}>
                OA Code{getSortIcon('oa')}
              </th>
              <th onClick={() => handleSort('latitude')} style={{ cursor: 'pointer' }}>
                Latitude{getSortIcon('latitude')}
              </th>
              <th onClick={() => handleSort('longitude')} style={{ cursor: 'pointer' }}>
                Longitude{getSortIcon('longitude')}
              </th>
              <th onClick={() => handleSort('population')} style={{ cursor: 'pointer' }}>
                Population{getSortIcon('population')}
              </th>
              <th onClick={() => handleSort('totalScore')} style={{ cursor: 'pointer' }}>
                Score{getSortIcon('totalScore')}
              </th>
              <th onClick={() => handleSort('distanceScore')} style={{ cursor: 'pointer' }}>
                Distance to Competitor{getSortIcon('distanceScore')}
              </th>
              <th>Priority</th>
            </tr>
          </thead>
          <tbody>
            {paginatedLocations.map((location, index) => {
              const globalRank = (currentPage - 1) * pageSize + index + 1;
              const priority = globalRank <= 50 ? 'High' : globalRank <= 200 ? 'Medium' : 'Low';
              const priorityColor = priority === 'High' ? '#28a745' : priority === 'Medium' ? '#ffc107' : '#6c757d';
              
              return (
                <tr key={`${location.oa}-${location.id}`}>
                  <td><strong>#{globalRank}</strong></td>
                  <td>{location.oa}</td>
                  <td>{Number(location.latitude).toFixed(6)}</td>
                  <td>{Number(location.longitude).toFixed(6)}</td>
                  <td>{location.population.toLocaleString()}</td>
                  <td>{Number(location.totalScore).toFixed(2)}</td>
                  <td>{Number(location.distanceScore).toFixed(2)}km</td>
                  <td>
                    <span style={{ color: priorityColor, fontWeight: '600' }}>
                      {priority}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ marginTop: '15px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
          <button 
            className="btn secondary" 
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          
          <span>Page {currentPage} of {totalPages}</span>
          
          <button 
            className="btn secondary" 
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
          
          <span style={{ marginLeft: '20px', fontSize: '14px', color: '#6c757d' }}>
            Showing {((currentPage - 1) * pageSize) + 1}-{Math.min(currentPage * pageSize, sortedLocations.length)} of {sortedLocations.length}
          </span>
        </div>
      )}
    </div>
  );
};

export default OptimizationResults;
