import React, { useState, useMemo } from 'react';

const CompetitorTable = ({ competitors, week }) => {
  const [sortField, setSortField] = useState('id');
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);

  const sortedCompetitors = useMemo(() => {
    if (!competitors || competitors.length === 0) return [];
    
    return [...competitors].sort((a, b) => {
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
  }, [competitors, sortField, sortDirection]);

  const paginatedCompetitors = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return sortedCompetitors.slice(startIndex, startIndex + pageSize);
  }, [sortedCompetitors, currentPage, pageSize]);

  const totalPages = Math.ceil(sortedCompetitors.length / pageSize);

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

  if (!competitors || competitors.length === 0) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: '#6c757d' }}>
        No competitor data available for {week}
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <strong>{week.toUpperCase()}</strong> - {competitors.length.toLocaleString()} competitor locations
        </div>
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
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </label>
        </div>
      </div>

      <div style={{ overflowX: 'auto', maxHeight: '400px', border: '1px solid #dee2e6' }}>
        <table className="table">
          <thead>
            <tr>
              <th onClick={() => handleSort('id')} style={{ cursor: 'pointer' }}>
                ID{getSortIcon('id')}
              </th>
              <th onClick={() => handleSort('latitude')} style={{ cursor: 'pointer' }}>
                Latitude{getSortIcon('latitude')}
              </th>
              <th onClick={() => handleSort('longitude')} style={{ cursor: 'pointer' }}>
                Longitude{getSortIcon('longitude')}
              </th>
              <th>Region</th>
            </tr>
          </thead>
          <tbody>
            {paginatedCompetitors.map((competitor, index) => (
              <tr key={`${competitor.id}-${index}`}>
                <td>{competitor.id}</td>
                <td>{Number(competitor.latitude).toFixed(6)}</td>
                <td>{Number(competitor.longitude).toFixed(6)}</td>
                <td>
                  {competitor.latitude > 55 ? 'Scotland' :
                   competitor.latitude > 52 ? 'Northern England' :
                   competitor.latitude > 51 ? 'Central England' : 'Southern England'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div style={{ marginTop: '15px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
          <button 
            className="btn secondary" 
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          
          <span>
            Page {currentPage} of {totalPages}
          </span>
          
          <button 
            className="btn secondary" 
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
          
          <span style={{ marginLeft: '20px', fontSize: '14px', color: '#6c757d' }}>
            Showing {((currentPage - 1) * pageSize) + 1}-{Math.min(currentPage * pageSize, competitors.length)} of {competitors.length.toLocaleString()}
          </span>
        </div>
      )}
    </div>
  );
};

export default CompetitorTable;
