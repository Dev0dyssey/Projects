import React, { useState, useMemo } from 'react';

const ChangeTrackingDashboard = ({ comparisonResults }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [riskThreshold, setRiskThreshold] = useState(10);


  const changeAnalysis = useMemo(() => {
    if (!comparisonResults.week1?.locations || !comparisonResults.week2?.locations) {
      return null;
    }

    const week1Locations = comparisonResults.week1.locations.map((loc, index) => ({
      ...loc,
      week1Rank: index + 1
    }));
    
    const week2Locations = comparisonResults.week2.locations.map((loc, index) => ({
      ...loc,
      week2Rank: index + 1
    }));


    const allOAs = new Set([
      ...week1Locations.map(loc => loc.oa),
      ...week2Locations.map(loc => loc.oa)
    ]);

    const locationChanges = Array.from(allOAs).map(oa => {
      const week1Data = week1Locations.find(loc => loc.oa === oa);
      const week2Data = week2Locations.find(loc => loc.oa === oa);
      
      let changeType = 'unknown';
      let riskLevel = 'low';
      let opportunityScore = 0;
      let rankChange = null;
      let volatility = 0;

      if (week1Data && week2Data) {

        changeType = 'stable';
        rankChange = week2Data.week2Rank - week1Data.week1Rank;
        

        volatility = Math.abs(rankChange);
        

        if (rankChange > riskThreshold) {
          riskLevel = 'high';
        } else if (rankChange > 5) {
          riskLevel = 'medium';
        }
        

        if (rankChange < 0) {
          opportunityScore = Math.abs(rankChange) * 10;
        }
      } else if (week1Data && !week2Data) {

        changeType = 'lost';
        riskLevel = 'critical';
        volatility = week1Data.week1Rank;
      } else if (!week1Data && week2Data) {

        changeType = 'new';
        opportunityScore = (500 - week2Data.week2Rank) * 2;
        riskLevel = 'low';
      }

      return {
        oa,
        latitude: (week1Data || week2Data).latitude,
        longitude: (week1Data || week2Data).longitude,
        population: (week1Data || week2Data).population,
        week1Rank: week1Data?.week1Rank || null,
        week1Score: week1Data?.totalScore || null,
        week2Rank: week2Data?.week2Rank || null,
        week2Score: week2Data?.totalScore || null,
        changeType,
        rankChange,
        volatility,
        riskLevel,
        opportunityScore
      };
    });


    const stableLocations = locationChanges.filter(loc => loc.changeType === 'stable');
    const newLocations = locationChanges.filter(loc => loc.changeType === 'new');
    const lostLocations = locationChanges.filter(loc => loc.changeType === 'lost');
    
    const improvedLocations = stableLocations.filter(loc => loc.rankChange < 0);
    const declinedLocations = stableLocations.filter(loc => loc.rankChange > 0);
    
    const highRiskLocations = locationChanges.filter(loc => loc.riskLevel === 'high' || loc.riskLevel === 'critical');
    const topOpportunities = locationChanges.filter(loc => loc.opportunityScore > 50).sort((a, b) => b.opportunityScore - a.opportunityScore);

    return {
      locationChanges,
      summary: {
        totalLocations: locationChanges.length,
        stableCount: stableLocations.length,
        newCount: newLocations.length,
        lostCount: lostLocations.length,
        improvedCount: improvedLocations.length,
        declinedCount: declinedLocations.length,
        highRiskCount: highRiskLocations.length,
        avgVolatility: stableLocations.reduce((sum, loc) => sum + loc.volatility, 0) / stableLocations.length || 0
      },
      insights: {
        topRisks: highRiskLocations.slice(0, 10),
        topOpportunities: topOpportunities.slice(0, 10),
        mostImproved: improvedLocations.sort((a, b) => a.rankChange - b.rankChange).slice(0, 5),
        mostDeclined: declinedLocations.sort((a, b) => b.rankChange - a.rankChange).slice(0, 5)
      }
    };
  }, [comparisonResults, riskThreshold]);

  if (!changeAnalysis) {
    return (
      <div className="card">
        <h2>Change Tracking Dashboard</h2>
        <div style={{
          padding: '40px',
          textAlign: 'center',
          background: '#f8f9fa',
          borderRadius: '4px'
        }}>
          <h3>No Comparison Data Available</h3>
          <p>Run a week comparison first to see change tracking insights.</p>
        </div>
      </div>
    );
  }

  const { summary, insights } = changeAnalysis;

  const getRiskColor = (level) => {
    switch (level) {
      case 'critical': return '#dc3545';
      case 'high': return '#fd7e14';
      case 'medium': return '#ffc107';
      default: return '#28a745';
    }
  };

  const getChangeIcon = (changeType) => {
    switch (changeType) {
      case 'stable': return '🔄';
      case 'new': return '🆕';
      case 'lost': return '❌';
      default: return '❓';
    }
  };

  return (
    <div className="card">
      <h2>Change Tracking Dashboard</h2>
      <p>Advanced analytics on location movement, risks, and opportunities between competitive weeks.</p>

      {/* Dashboard Tabs */}
      <div style={{ 
        display: 'flex', 
        borderBottom: '1px solid #dee2e6', 
        marginBottom: '20px',
        gap: '5px'
      }}>
        {[
          { key: 'overview', label: 'Overview' },
          { key: 'risks', label: 'Risk Analysis' },
          { key: 'opportunities', label: 'Opportunities' },
          { key: 'movements', label: 'Location Movements' }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: '10px 20px',
              border: 'none',
              background: activeTab === tab.key ? '#007bff' : 'transparent',
              color: activeTab === tab.key ? 'white' : '#007bff',
              cursor: 'pointer',
              borderRadius: '4px 4px 0 0',
              fontWeight: activeTab === tab.key ? '600' : '400'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div>
          <h3>Change Summary</h3>
          <div className="stats-grid" style={{ marginBottom: '30px' }}>
            <div className="stat-card">
              <div className="stat-value">{summary.stableCount}</div>
              <div className="stat-label">Stable Locations</div>
            </div>
            <div className="stat-card">
              <div className="stat-value" style={{ color: '#007bff' }}>{summary.newCount}</div>
              <div className="stat-label">New Opportunities</div>
            </div>
            <div className="stat-card">
              <div className="stat-value" style={{ color: '#dc3545' }}>{summary.lostCount}</div>
              <div className="stat-label">Lost Positions</div>
            </div>
            <div className="stat-card">
              <div className="stat-value" style={{ color: '#28a745' }}>{summary.improvedCount}</div>
              <div className="stat-label">Improved Rankings</div>
            </div>
            <div className="stat-card">
              <div className="stat-value" style={{ color: '#fd7e14' }}>{summary.declinedCount}</div>
              <div className="stat-label">Declined Rankings</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{summary.avgVolatility.toFixed(1)}</div>
              <div className="stat-label">Avg Volatility</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div style={{
              background: '#f8f9fa',
              padding: '20px',
              borderRadius: '4px'
            }}>
              <h4>Market Stability Analysis</h4>
              <div style={{ fontSize: '14px' }}>
                <p><strong>Location Retention:</strong> {((summary.stableCount / summary.totalLocations) * 100).toFixed(1)}%</p>
                <p><strong>Market Turnover:</strong> {(((summary.newCount + summary.lostCount) / summary.totalLocations) * 100).toFixed(1)}%</p>
                <p><strong>Improvement Rate:</strong> {summary.stableCount > 0 ? ((summary.improvedCount / summary.stableCount) * 100).toFixed(1) : 0}%</p>
                <p><strong>High Risk Locations:</strong> {summary.highRiskCount}</p>
              </div>
            </div>

            <div style={{
              background: '#fff3cd',
              padding: '20px',
              borderRadius: '4px'
            }}>
              <h4>Strategic Recommendations</h4>
              <div style={{ fontSize: '14px' }}>
                {summary.lostCount > summary.newCount && (
                  <p>🔴 <strong>Focus on retention:</strong> More locations lost than gained</p>
                )}
                {summary.newCount > summary.lostCount && (
                  <p>🟢 <strong>Market expansion:</strong> More new opportunities than losses</p>
                )}
                {summary.avgVolatility > 20 && (
                  <p>⚠️ <strong>High volatility:</strong> Consider more stable location criteria</p>
                )}
                {summary.highRiskCount > 10 && (
                  <p>🟡 <strong>Risk management:</strong> {summary.highRiskCount} locations at risk</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Risk Analysis Tab */}
      {activeTab === 'risks' && (
        <div>
          <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
            <h3>Risk Analysis</h3>
            <div>
              <label style={{ fontSize: '14px', marginRight: '10px' }}>
                Risk Threshold (ranking decline):
              </label>
              <input
                type="range"
                min="5"
                max="50"
                value={riskThreshold}
                onChange={(e) => setRiskThreshold(Number(e.target.value))}
                style={{ marginRight: '10px' }}
              />
              <span>{riskThreshold} positions</span>
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <h4>High Risk Locations</h4>
            {insights.topRisks.length > 0 ? (
              <div style={{ overflowX: 'auto' }}>
                <table className="table">
                  <thead>
                    <tr>
                      <th>OA Code</th>
                      <th>Risk Level</th>
                      <th>Change Type</th>
                      <th>Ranking Change</th>
                      <th>Population</th>
                      <th>Week 1 → Week 2</th>
                    </tr>
                  </thead>
                  <tbody>
                    {insights.topRisks.map((location) => (
                      <tr key={location.oa}>
                        <td><strong>{location.oa}</strong></td>
                        <td>
                          <span style={{ 
                            color: getRiskColor(location.riskLevel),
                            fontWeight: '600',
                            textTransform: 'uppercase',
                            fontSize: '12px'
                          }}>
                            {location.riskLevel}
                          </span>
                        </td>
                        <td>{getChangeIcon(location.changeType)} {location.changeType}</td>
                        <td>
                          {location.rankChange !== null && (
                            <span style={{ color: location.rankChange > 0 ? '#dc3545' : '#28a745' }}>
                              {location.rankChange > 0 ? '+' : ''}{location.rankChange}
                            </span>
                          )}
                        </td>
                        <td>{location.population.toLocaleString()}</td>
                        <td>
                          {location.week1Rank ? `#${location.week1Rank}` : '-'} → {location.week2Rank ? `#${location.week2Rank}` : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p style={{ color: '#28a745', fontStyle: 'italic' }}>No high-risk locations identified!</p>
            )}
          </div>
        </div>
      )}

      {/* Opportunities Tab */}
      {activeTab === 'opportunities' && (
        <div>
          <h3>Top Opportunities</h3>
          
          <div style={{ marginBottom: '30px' }}>
            <h4>New High-Value Locations (Week 2 Only)</h4>
            {insights.topOpportunities.length > 0 ? (
              <div style={{ overflowX: 'auto' }}>
                <table className="table">
                  <thead>
                    <tr>
                      <th>OA Code</th>
                      <th>Week 2 Rank</th>
                      <th>Population</th>
                      <th>Opportunity Score</th>
                      <th>Total Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {insights.topOpportunities.map((location) => (
                      <tr key={location.oa}>
                        <td><strong>{location.oa}</strong></td>
                        <td>#{location.week2Rank}</td>
                        <td>{location.population.toLocaleString()}</td>
                        <td>
                          <span style={{ 
                            color: '#007bff',
                            fontWeight: '600'
                          }}>
                            {location.opportunityScore.toFixed(0)}
                          </span>
                        </td>
                        <td>{location.week2Score?.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p>No new high-value opportunities identified.</p>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <h4>Most Improved Stable Locations</h4>
              {insights.mostImproved.length > 0 ? (
                <div style={{ fontSize: '14px' }}>
                  {insights.mostImproved.map((location) => (
                    <div key={location.oa} style={{ 
                      padding: '8px',
                      background: '#d4edda',
                      marginBottom: '5px',
                      borderRadius: '4px'
                    }}>
                      <strong>{location.oa}</strong> improved by {Math.abs(location.rankChange)} positions
                      <br />
                      <small>#{location.week1Rank} → #{location.week2Rank}</small>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No improved locations.</p>
              )}
            </div>

            <div>
              <h4>Largest Declines</h4>
              {insights.mostDeclined.length > 0 ? (
                <div style={{ fontSize: '14px' }}>
                  {insights.mostDeclined.map((location) => (
                    <div key={location.oa} style={{ 
                      padding: '8px',
                      background: '#f8d7da',
                      marginBottom: '5px',
                      borderRadius: '4px'
                    }}>
                      <strong>{location.oa}</strong> declined by {location.rankChange} positions
                      <br />
                      <small>#{location.week1Rank} → #{location.week2Rank}</small>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No declined locations.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Location Movements Tab */}
      {activeTab === 'movements' && (
        <div>
          <h3>Location Movement Analysis</h3>
          <p>Detailed view of how individual locations moved between competitive weeks.</p>
          
          <div style={{ marginBottom: '20px' }}>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-value" style={{ color: '#28a745' }}>
                  {changeAnalysis.locationChanges.filter(loc => loc.changeType === 'stable' && loc.rankChange < 0).length}
                </div>
                <div className="stat-label">Locations Moving Up</div>
              </div>
              <div className="stat-card">
                <div className="stat-value" style={{ color: '#dc3545' }}>
                  {changeAnalysis.locationChanges.filter(loc => loc.changeType === 'stable' && loc.rankChange > 0).length}
                </div>
                <div className="stat-label">Locations Moving Down</div>
              </div>
              <div className="stat-card">
                <div className="stat-value" style={{ color: '#6c757d' }}>
                  {changeAnalysis.locationChanges.filter(loc => loc.changeType === 'stable' && loc.rankChange === 0).length}
                </div>
                <div className="stat-label">No Change</div>
              </div>
            </div>
          </div>

          <div style={{ 
            background: '#f8f9fa',
            padding: '15px',
            borderRadius: '4px',
            fontSize: '14px'
          }}>
            <h4>Movement Patterns</h4>
            <p>
              The volatility score shows how much locations moved in ranking. 
              Higher volatility indicates a more dynamic competitive landscape.
            </p>
            <p>
              <strong>Overall Market Volatility:</strong> {summary.avgVolatility.toFixed(1)} positions on average
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChangeTrackingDashboard;
