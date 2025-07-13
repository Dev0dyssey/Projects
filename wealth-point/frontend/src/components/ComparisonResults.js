import React, { useState, useMemo } from 'react';

const ComparisonResults = ({ week1Results, week2Results, maxLocations }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [sortField, setSortField] = useState('week1Rank');
  const [sortDirection, setSortDirection] = useState('asc');


  const combinedAnalysis = useMemo(() => {
    if (!week1Results?.locations || !week2Results?.locations) return [];
    
    const week1Locations = week1Results.locations.map((loc, index) => ({
      ...loc,
      week1Rank: index + 1,
      week1Score: loc.totalScore,
      week1Distance: loc.distanceScore
    }));
    
    const week2Locations = week2Results.locations.map((loc, index) => ({
      ...loc,
      week2Rank: index + 1,
      week2Score: loc.totalScore,
      week2Distance: loc.distanceScore
    }));


    const allOAs = new Set([
      ...week1Locations.map(loc => loc.oa),
      ...week2Locations.map(loc => loc.oa)
    ]);


    const combined = Array.from(allOAs).map(oa => {
      const week1Data = week1Locations.find(loc => loc.oa === oa);
      const week2Data = week2Locations.find(loc => loc.oa === oa);
      
      const result = {
        oa,
        latitude: (week1Data || week2Data).latitude,
        longitude: (week1Data || week2Data).longitude,
        population: (week1Data || week2Data).population,
        

        week1Rank: week1Data?.week1Rank || null,
        week1Score: week1Data?.week1Score || null,
        week1Distance: week1Data?.week1Distance || null,
        

        week2Rank: week2Data?.week2Rank || null,
        week2Score: week2Data?.week2Score || null,
        week2Distance: week2Data?.week2Distance || null,
        

        inBothWeeks: !!(week1Data && week2Data),
        weekChange: null,
        status: 'unknown'
      };


      if (week1Data && week2Data) {
        result.weekChange = week2Data.week2Rank - week1Data.week1Rank;
        result.status = 'stable';
      } else if (week1Data && !week2Data) {
        result.status = 'lost';
      } else if (!week1Data && week2Data) {
        result.status = 'new';
      }

      return result;
    });

    return combined;
  }, [week1Results, week2Results]);


  const sortedData = useMemo(() => {
    return [...combinedAnalysis].sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];
      

      if (aVal === null && bVal === null) return 0;
      if (aVal === null) return 1;
      if (bVal === null) return -1;
      
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
  }, [combinedAnalysis, sortField, sortDirection]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const totalPages = Math.ceil(sortedData.length / pageSize);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'stable': return '#28a745';
      case 'new': return '#007bff';
      case 'lost': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'stable': return 'Both Weeks';
      case 'new': return 'Week 2 Only';
      case 'lost': return 'Week 1 Only';
      default: return 'Unknown';
    }
  };

  const getRankChangeIcon = (change) => {
    if (change === null) return '';
    if (change === 0) return ' ➡️';
    if (change > 0) return ` ↓${change}`;
    return ` ↑${Math.abs(change)}`;
  };


  const stableLocations = combinedAnalysis.filter(loc => loc.status === 'stable').length;
  const newLocations = combinedAnalysis.filter(loc => loc.status === 'new').length;
  const lostLocations = combinedAnalysis.filter(loc => loc.status === 'lost').length;

  return (
    <div style={{ marginTop: '30px' }}>
      <h2>Week Comparison Results</h2>
      
      {/* Summary Statistics */}
      <div className="stats-grid" style={{ marginBottom: '20px' }}>
        <div className="stat-card">
          <div className="stat-value">{week1Results.totalSelected}</div>
          <div className="stat-label">Week 1 Locations</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{week2Results.totalSelected}</div>
          <div className="stat-label">Week 2 Locations</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: '#28a745' }}>{stableLocations}</div>
          <div className="stat-label">Stable Locations</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: '#007bff' }}>{newLocations}</div>
          <div className="stat-label">New in Week 2</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: '#dc3545' }}>{lostLocations}</div>
          <div className="stat-label">Lost from Week 1</div>
        </div>
      </div>

      {/* Market Impact Analysis */}
      <div style={{
        background: '#f8f9fa',
        padding: '15px',
        borderRadius: '4px',
        marginBottom: '20px'
      }}>
        <h4>Market Impact Analysis</h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', fontSize: '14px' }}>
          <div>
            <p><strong>Population Coverage Change:</strong></p>
            <p>Week 1: {week1Results.summary?.totalPopulationCovered?.toLocaleString()}</p>
            <p>Week 2: {week2Results.summary?.totalPopulationCovered?.toLocaleString()}</p>
            <p style={{ color: week2Results.summary?.totalPopulationCovered > week1Results.summary?.totalPopulationCovered ? '#28a745' : '#dc3545' }}>
              Change: {((week2Results.summary?.totalPopulationCovered - week1Results.summary?.totalPopulationCovered) || 0).toLocaleString()}
            </p>
          </div>
          <div>
            <p><strong>Competitive Distance Change:</strong></p>
            <p>Week 1 Avg: {week1Results.summary?.averageDistanceToNearestCompetitor}km</p>
            <p>Week 2 Avg: {week2Results.summary?.averageDistanceToNearestCompetitor}km</p>
            <p style={{ color: week2Results.summary?.averageDistanceToNearestCompetitor > week1Results.summary?.averageDistanceToNearestCompetitor ? '#28a745' : '#dc3545' }}>
              Change: {((week2Results.summary?.averageDistanceToNearestCompetitor - week1Results.summary?.averageDistanceToNearestCompetitor) || 0).toFixed(2)}km
            </p>
          </div>
        </div>
      </div>

      {/* Export Options */}
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <button 
          className="btn"
          onClick={() => {
            const csvContent = [
              ['OA', 'Latitude', 'Longitude', 'Population', 'Status', 'Week1_Rank', 'Week1_Score', 'Week2_Rank', 'Week2_Score', 'Rank_Change'],
              ...sortedData.map(loc => [
                loc.oa,
                loc.latitude,
                loc.longitude,
                loc.population,
                getStatusLabel(loc.status),
                loc.week1Rank || '',
                (loc.week1Score || 0).toFixed(2),
                loc.week2Rank || '',
                (loc.week2Score || 0).toFixed(2),
                loc.weekChange || ''
              ])
            ].map(row => row.join(',')).join('\n');
            
            const blob = new Blob([csvContent], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'week_comparison_results.csv';
            a.click();
            window.URL.revokeObjectURL(url);
          }}
        >
          Export Comparison
        </button>
      </div>

      {/* Comparison Table */}
      <div style={{ marginBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3>Location Comparison Table</h3>
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
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </label>
        </div>
      </div>

      <div style={{ overflowX: 'auto', maxHeight: '600px', border: '1px solid #dee2e6' }}>
        <table className="table">
          <thead>
            <tr>
              <th onClick={() => handleSort('oa')} style={{ cursor: 'pointer' }}>
                OA Code{getSortIcon('oa')}
              </th>
              <th>Status</th>
              <th onClick={() => handleSort('population')} style={{ cursor: 'pointer' }}>
                Population{getSortIcon('population')}
              </th>
              <th onClick={() => handleSort('week1Rank')} style={{ cursor: 'pointer' }}>
                Week 1 Rank{getSortIcon('week1Rank')}
              </th>
              <th onClick={() => handleSort('week1Score')} style={{ cursor: 'pointer' }}>
                Week 1 Score{getSortIcon('week1Score')}
              </th>
              <th onClick={() => handleSort('week2Rank')} style={{ cursor: 'pointer' }}>
                Week 2 Rank{getSortIcon('week2Rank')}
              </th>
              <th onClick={() => handleSort('week2Score')} style={{ cursor: 'pointer' }}>
                Week 2 Score{getSortIcon('week2Score')}
              </th>
              <th>Change</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((location) => (
              <tr key={location.oa}>
                <td><strong>{location.oa}</strong></td>
                <td>
                  <span style={{ 
                    color: getStatusColor(location.status), 
                    fontWeight: '600',
                    fontSize: '12px'
                  }}>
                    {getStatusLabel(location.status)}
                  </span>
                </td>
                <td>{location.population.toLocaleString()}</td>
                <td>{location.week1Rank ? `#${location.week1Rank}` : '-'}</td>
                <td>{location.week1Score ? location.week1Score.toFixed(2) : '-'}</td>
                <td>{location.week2Rank ? `#${location.week2Rank}` : '-'}</td>
                <td>{location.week2Score ? location.week2Score.toFixed(2) : '-'}</td>
                <td>
                  {location.weekChange !== null && (
                    <span style={{ 
                      color: location.weekChange < 0 ? '#28a745' : location.weekChange > 0 ? '#dc3545' : '#6c757d',
                      fontWeight: '600'
                    }}>
                      {getRankChangeIcon(location.weekChange)}
                    </span>
                  )}
                </td>
              </tr>
            ))}
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
            Showing {((currentPage - 1) * pageSize) + 1}-{Math.min(currentPage * pageSize, sortedData.length)} of {sortedData.length}
          </span>
        </div>
      )}
    </div>
  );
};

export default ComparisonResults;
