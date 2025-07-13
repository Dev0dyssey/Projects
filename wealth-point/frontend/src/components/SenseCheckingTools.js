import React, { useState, useEffect, useCallback } from 'react';

const SenseCheckingTools = ({ 
  optimizationResults, 
  comparisonResults, 
  comparisonMode 
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [analysisData, setAnalysisData] = useState(null);


  const generateStrategicRecommendations = useCallback((riskAnalysis, opportunityAnalysis, mode) => {
    const recommendations = {
      immediate: [],
      strategic: [],
      monitoring: [],
      priority: 'medium'
    };

    if (mode === 'comparison') {

      if (riskAnalysis.highRiskLocations.length > 10) {
        recommendations.immediate.push({
          type: 'risk-mitigation',
          title: 'High Location Volatility Detected',
          description: `${riskAnalysis.highRiskLocations.length} locations show significant risk. Consider defensive positioning.`,
          action: 'Review competitor movements and adjust location strategy'
        });
        recommendations.priority = 'high';
      }

      if (riskAnalysis.competitorPressure === 'high') {
        recommendations.strategic.push({
          type: 'competitive-response',
          title: 'Intensified Competitor Activity',
          description: 'High competitor pressure detected across multiple locations.',
          action: 'Implement counter-positioning strategy and identify defensive opportunities'
        });
      }


      if (opportunityAnalysis.highValueTargets.length > 0) {
        recommendations.immediate.push({
          type: 'opportunity-capture',
          title: 'High-Value Opportunities Identified',
          description: `${opportunityAnalysis.highValueTargets.length} locations show significant improvement potential.`,
          action: 'Prioritize investment in top-performing emerging locations'
        });
      }

      if (opportunityAnalysis.growthPotential === 'high') {
        recommendations.strategic.push({
          type: 'expansion',
          title: 'Strong Growth Potential',
          description: 'Market conditions favor expansion and increased location coverage.',
          action: 'Consider increasing location count to capture additional market share'
        });
      }
    } else {

      recommendations.strategic.push({
        type: 'baseline-optimization',
        title: 'Optimization Baseline Established',
        description: 'Current location set provides strong market coverage.',
        action: 'Monitor competitor movements and prepare responsive strategies'
      });

      if (opportunityAnalysis.undervaluedAreas.length > 0) {
        recommendations.immediate.push({
          type: 'undervalued-capture',
          title: 'Undervalued Areas Identified',
          description: `${opportunityAnalysis.undervaluedAreas.length} high-population areas with good competitor distance.`,
          action: 'Investigate market entry barriers for undervalued locations'
        });
      }
    }


    recommendations.monitoring.push({
      type: 'trend-analysis',
      title: 'Continue Performance Monitoring',
      description: 'Regular analysis recommended to track market dynamics.',
      action: 'Schedule weekly optimization comparisons'
    });

    return recommendations;
  }, []);


  const calculateComparisonAnalysis = useCallback(() => {
    const week1 = comparisonResults.week1;
    const week2 = comparisonResults.week2;
    

    const riskAnalysis = {
      highRiskLocations: [],
      volatilityScore: 0,
      stabilityRate: 0,
      competitorPressure: 'low'
    };
    
    if (week1.locations && week2.locations) {

      const week1OAs = new Set(week1.locations.map(loc => loc.oa));
      const week2OAs = new Set(week2.locations.map(loc => loc.oa));
      
      const stableCount = week1.locations.filter(loc => week2OAs.has(loc.oa)).length;
      const lostCount = week1.locations.filter(loc => !week2OAs.has(loc.oa)).length;
      const newCount = week2.locations.filter(loc => !week1OAs.has(loc.oa)).length;
      
      riskAnalysis.stabilityRate = stableCount / Math.max(week1.totalSelected, week2.totalSelected);
      riskAnalysis.volatilityScore = (lostCount + newCount) / Math.max(week1.totalSelected, week2.totalSelected);
      

      week1.locations.forEach((w1Loc, w1Index) => {
        const w2Loc = week2.locations.find(loc => loc.oa === w1Loc.oa);
        if (w2Loc) {
          const w2Index = week2.locations.findIndex(loc => loc.oa === w1Loc.oa);
          const rankChange = w2Index - w1Index;
          
          if (rankChange > 50 || (w1Loc.totalScore - w2Loc.totalScore) / w1Loc.totalScore > 0.2) {
            riskAnalysis.highRiskLocations.push({
              oa: w1Loc.oa,
              week1Rank: w1Index + 1,
              week2Rank: w2Index + 1,
              rankChange,
              scoreChange: ((w2Loc.totalScore - w1Loc.totalScore) / w1Loc.totalScore * 100).toFixed(1),
              riskLevel: rankChange > 100 ? 'critical' : rankChange > 50 ? 'high' : 'medium',
              reason: rankChange > 50 ? 'Significant ranking decline' : 'Score degradation detected'
            });
          }
        } else {

          riskAnalysis.highRiskLocations.push({
            oa: w1Loc.oa,
            week1Rank: w1Index + 1,
            week2Rank: null,
            rankChange: 'eliminated',
            scoreChange: '-100.0',
            riskLevel: 'critical',
            reason: 'Location no longer viable'
          });
        }
      });
      

      if (riskAnalysis.volatilityScore > 0.4) {
        riskAnalysis.competitorPressure = 'high';
      } else if (riskAnalysis.volatilityScore > 0.2) {
        riskAnalysis.competitorPressure = 'medium';
      }
    }
    

    const opportunityAnalysis = {
      highValueTargets: [],
      emergingOpportunities: [],
      growthPotential: 'stable'
    };
    
    if (week1.locations && week2.locations) {

      week2.locations.forEach((w2Loc, w2Index) => {
        const w1Loc = week1.locations.find(loc => loc.oa === w2Loc.oa);
        if (w1Loc) {
          const w1Index = week1.locations.findIndex(loc => loc.oa === w2Loc.oa);
          const rankImprovement = w1Index - w2Index;
          
          if (rankImprovement > 20 || (w2Loc.totalScore - w1Loc.totalScore) / w1Loc.totalScore > 0.15) {
            opportunityAnalysis.highValueTargets.push({
              oa: w2Loc.oa,
              week1Rank: w1Index + 1,
              week2Rank: w2Index + 1,
              rankImprovement,
              scoreImprovement: ((w2Loc.totalScore - w1Loc.totalScore) / w1Loc.totalScore * 100).toFixed(1),
              opportunityLevel: rankImprovement > 50 ? 'exceptional' : 'high',
              reason: 'Significant performance improvement'
            });
          }
        } else if (w2Index < 100) {

          opportunityAnalysis.emergingOpportunities.push({
            oa: w2Loc.oa,
            week2Rank: w2Index + 1,
            score: w2Loc.totalScore,
            population: w2Loc.population,
            reason: 'New high-performing location'
          });
        }
      });
      

      if (week2.summary.totalPopulation > week1.summary.totalPopulation * 1.05) {
        opportunityAnalysis.growthPotential = 'high';
      } else if (week2.summary.totalPopulation > week1.summary.totalPopulation * 1.02) {
        opportunityAnalysis.growthPotential = 'moderate';
      }
    }
    
    const recommendations = generateStrategicRecommendations(riskAnalysis, opportunityAnalysis, 'comparison');
    
    setAnalysisData({
      type: 'comparison',
      riskAnalysis,
      opportunityAnalysis,
      recommendations,
      processed: true,
      timestamp: new Date().toISOString()
    });
  }, [comparisonResults, generateStrategicRecommendations]);

  const calculateSingleWeekAnalysis = useCallback(() => {

    const locations = optimizationResults.locations || [];
    

    const riskAnalysis = {
      highRiskLocations: locations.slice(-20).map((loc, index) => ({
        oa: loc.oa,
        rank: locations.length - 19 + index,
        score: loc.totalScore,
        riskLevel: 'low',
        reason: 'Bottom-ranked location - monitor for competitor proximity'
      })),
      volatilityScore: 0.1,
      stabilityRate: 1.0,
      competitorPressure: 'unknown'
    };
    

    const opportunityAnalysis = {
      highValueTargets: locations.slice(0, 20).map((loc, index) => ({
        oa: loc.oa,
        rank: index + 1,
        score: loc.totalScore,
        population: loc.population,
        distanceToCompetitor: loc.distanceToNearestCompetitor,
        opportunityType: 'top-performer',
        potential: 'high',
        reason: `Rank ${index + 1} - Excellent population-to-competition ratio`
      })),
      undervaluedAreas: [],
      growthPotential: 'stable'
    };
    

    locations.forEach((loc, index) => {
      if (loc.population > 500 && index > 100 && loc.distanceToNearestCompetitor > 2.0) {
        opportunityAnalysis.undervaluedAreas.push({
          oa: loc.oa,
          rank: index + 1,
          population: loc.population,
          distance: loc.distanceToNearestCompetitor,
          reason: 'High population with good competitor distance but lower ranking'
        });
      }
    });
    
    const recommendations = generateStrategicRecommendations(riskAnalysis, opportunityAnalysis, 'single');
    
    setAnalysisData({
      type: 'single',
      riskAnalysis,
      opportunityAnalysis,
      recommendations,
      processed: true,
      timestamp: new Date().toISOString()
    });
  }, [optimizationResults, generateStrategicRecommendations]);

  useEffect(() => {
    if (comparisonMode && comparisonResults.week1 && comparisonResults.week2) {
      calculateComparisonAnalysis();
    } else if (!comparisonMode && optimizationResults) {
      calculateSingleWeekAnalysis();
    }
  }, [optimizationResults, comparisonResults, comparisonMode, calculateComparisonAnalysis, calculateSingleWeekAnalysis]);



  const hasData = comparisonMode ? 
    (comparisonResults.week1 && comparisonResults.week2) : 
    optimizationResults;

  if (!hasData) {
    return (
      <div className="card">
        <h2>🔍 Advanced Sense-Checking Tools</h2>
        <div style={{
          background: '#fff3cd',
          color: '#856404',
          padding: '20px',
          borderRadius: '4px',
          textAlign: 'center'
        }}>
          <h4>No Data Available</h4>
          <p>Run an optimization first to access advanced sense-checking tools.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <h2>🔍 Advanced Sense-Checking Tools</h2>
      <p>
        Comprehensive analysis and strategic recommendations for your optimization results.
      </p>

      {/* Tab Navigation */}
      <div style={{
        display: 'flex',
        borderBottom: '2px solid #dee2e6',
        marginBottom: '20px'
      }}>
        {[
          { id: 'overview', label: '📊 Overview', desc: 'Summary insights' },
          { id: 'risks', label: '⚠️ Risk Analysis', desc: 'Identify vulnerabilities' },
          { id: 'opportunities', label: '🎯 Opportunities', desc: 'Growth potential' },
          { id: 'recommendations', label: '💡 Strategic Advice', desc: 'Action items' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              background: activeTab === tab.id ? '#007bff' : 'transparent',
              color: activeTab === tab.id ? 'white' : '#007bff',
              border: 'none',
              padding: '12px 20px',
              cursor: 'pointer',
              borderRadius: '4px 4px 0 0',
              marginRight: '2px',
              fontSize: '14px',
              fontWeight: activeTab === tab.id ? '600' : '400'
            }}
            title={tab.desc}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div style={{ minHeight: '300px' }}>
        {activeTab === 'overview' && (
          <OverviewTab 
            analysisData={analysisData}
            comparisonMode={comparisonMode}
            results={comparisonMode ? comparisonResults : optimizationResults}
          />
        )}
        
        {activeTab === 'risks' && (
          <RiskAnalysisTab 
            analysisData={analysisData}
            comparisonMode={comparisonMode}
            results={comparisonMode ? comparisonResults : optimizationResults}
          />
        )}
        
        {activeTab === 'opportunities' && (
          <OpportunitiesTab 
            analysisData={analysisData}
            comparisonMode={comparisonMode}
            results={comparisonMode ? comparisonResults : optimizationResults}
          />
        )}
        
        {activeTab === 'recommendations' && (
          <RecommendationsTab 
            analysisData={analysisData}
            comparisonMode={comparisonMode}
            results={comparisonMode ? comparisonResults : optimizationResults}
          />
        )}
      </div>
    </div>
  );
};


const OverviewTab = ({ analysisData, comparisonMode, results }) => {
  if (!analysisData) {
    return <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>Processing analysis...</div>;
  }

  const { riskAnalysis, opportunityAnalysis } = analysisData;

  return (
    <div>
      <h3>📊 Analysis Overview</h3>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '20px' }}>
        {/* Risk Summary */}
        <div style={{ background: '#fff3cd', padding: '20px', borderRadius: '8px', border: '1px solid #ffeaa7' }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#856404' }}>🚨 Risk Summary</h4>
          <div style={{ fontSize: '14px' }}>
            <strong>High-Risk Locations:</strong> {riskAnalysis.highRiskLocations?.length || 0}<br/>
            <strong>Stability Rate:</strong> {((riskAnalysis.stabilityRate || 0) * 100).toFixed(1)}%<br/>
            <strong>Competitor Pressure:</strong> <span style={{ textTransform: 'capitalize', fontWeight: 'bold' }}>{riskAnalysis.competitorPressure}</span>
          </div>
        </div>

        {/* Opportunity Summary */}
        <div style={{ background: '#d4edda', padding: '20px', borderRadius: '8px', border: '1px solid #c3e6cb' }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#155724' }}>🎯 Opportunities</h4>
          <div style={{ fontSize: '14px' }}>
            <strong>High-Value Targets:</strong> {opportunityAnalysis.highValueTargets?.length || 0}<br/>
            {comparisonMode && <><strong>Emerging Opportunities:</strong> {opportunityAnalysis.emergingOpportunities?.length || 0}<br/></>}
            {!comparisonMode && <><strong>Undervalued Areas:</strong> {opportunityAnalysis.undervaluedAreas?.length || 0}<br/></>}
            <strong>Growth Potential:</strong> <span style={{ textTransform: 'capitalize', fontWeight: 'bold' }}>{opportunityAnalysis.growthPotential}</span>
          </div>
        </div>
      </div>

      {/* Key Insights */}
      <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px' }}>
        <h4 style={{ margin: '0 0 15px 0' }}>🔍 Key Insights</h4>
        <ul style={{ margin: '0', paddingLeft: '20px' }}>
          {comparisonMode ? (
            <>
              <li>Location volatility: {((riskAnalysis.volatilityScore || 0) * 100).toFixed(1)}% of locations changed</li>
              <li>Market dynamics: {riskAnalysis.competitorPressure === 'high' ? 'High competitive pressure detected' : 'Stable competitive environment'}</li>
              <li>Growth trajectory: {opportunityAnalysis.growthPotential === 'high' ? 'Strong expansion opportunities' : 'Steady market conditions'}</li>
            </>
          ) : (
            <>
              <li>Current optimization covers {results.locations?.length || 0} strategic locations</li>
              <li>Population coverage: {(results.summary?.totalPopulation || 0).toLocaleString()} people</li>
              <li>Strategic focus: {opportunityAnalysis.undervaluedAreas?.length > 5 ? 'Expansion opportunities available' : 'Current coverage optimized'}</li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

const RiskAnalysisTab = ({ analysisData, comparisonMode, results }) => {
  if (!analysisData?.riskAnalysis) {
    return <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>Processing risk analysis...</div>;
  }

  const { riskAnalysis } = analysisData;
  const highRiskLocations = riskAnalysis.highRiskLocations || [];

  return (
    <div>
      <h3>⚠️ Risk Analysis</h3>
      
      {/* Risk Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '25px' }}>
        <div style={{ background: '#f8d7da', padding: '15px', borderRadius: '6px', textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#721c24' }}>{highRiskLocations.length}</div>
          <div style={{ fontSize: '12px', color: '#721c24' }}>High-Risk Locations</div>
        </div>
        <div style={{ background: '#fff3cd', padding: '15px', borderRadius: '6px', textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#856404' }}>{((riskAnalysis.stabilityRate || 0) * 100).toFixed(0)}%</div>
          <div style={{ fontSize: '12px', color: '#856404' }}>Stability Rate</div>
        </div>
        <div style={{ background: '#cce5ff', padding: '15px', borderRadius: '6px', textAlign: 'center' }}>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#004085', textTransform: 'capitalize' }}>{riskAnalysis.competitorPressure}</div>
          <div style={{ fontSize: '12px', color: '#004085' }}>Competitor Pressure</div>
        </div>
      </div>

      {/* High-Risk Locations Table */}
      {highRiskLocations.length > 0 && (
        <div>
          <h4>🚨 High-Risk Locations</h4>
          <div style={{ maxHeight: '300px', overflowY: 'auto', border: '1px solid #dee2e6', borderRadius: '4px' }}>
            <table style={{ width: '100%', fontSize: '14px' }}>
              <thead style={{ background: '#f8f9fa', position: 'sticky', top: 0 }}>
                <tr>
                  <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Location</th>
                  {comparisonMode && <th style={{ padding: '10px', textAlign: 'center', borderBottom: '1px solid #dee2e6' }}>Week 1 Rank</th>}
                  {comparisonMode && <th style={{ padding: '10px', textAlign: 'center', borderBottom: '1px solid #dee2e6' }}>Week 2 Rank</th>}
                  {!comparisonMode && <th style={{ padding: '10px', textAlign: 'center', borderBottom: '1px solid #dee2e6' }}>Rank</th>}
                  <th style={{ padding: '10px', textAlign: 'center', borderBottom: '1px solid #dee2e6' }}>Risk Level</th>
                  <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Reason</th>
                </tr>
              </thead>
              <tbody>
                {highRiskLocations.slice(0, 10).map((location, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid #f8f9fa' }}>
                    <td style={{ padding: '8px 10px' }}>{location.oa}</td>
                    {comparisonMode && <td style={{ padding: '8px 10px', textAlign: 'center' }}>{location.week1Rank}</td>}
                    {comparisonMode && <td style={{ padding: '8px 10px', textAlign: 'center' }}>{location.week2Rank || 'Lost'}</td>}
                    {!comparisonMode && <td style={{ padding: '8px 10px', textAlign: 'center' }}>{location.rank}</td>}
                    <td style={{ padding: '8px 10px', textAlign: 'center' }}>
                      <span style={{
                        padding: '3px 8px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        background: location.riskLevel === 'critical' ? '#f8d7da' : location.riskLevel === 'high' ? '#fff3cd' : '#d1ecf1',
                        color: location.riskLevel === 'critical' ? '#721c24' : location.riskLevel === 'high' ? '#856404' : '#0c5460'
                      }}>
                        {location.riskLevel}
                      </span>
                    </td>
                    <td style={{ padding: '8px 10px', fontSize: '13px' }}>{location.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {highRiskLocations.length > 10 && (
            <p style={{ fontSize: '12px', color: '#666', textAlign: 'center', margin: '10px 0' }}>
              Showing top 10 of {highRiskLocations.length} high-risk locations
            </p>
          )}
        </div>
      )}

      {highRiskLocations.length === 0 && (
        <div style={{ background: '#d4edda', color: '#155724', padding: '20px', borderRadius: '4px', textAlign: 'center' }}>
          <strong>✅ Good News!</strong> No high-risk locations detected in current analysis.
        </div>
      )}
    </div>
  );
};

const OpportunitiesTab = ({ analysisData, comparisonMode, results }) => {
  if (!analysisData?.opportunityAnalysis) {
    return <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>Processing opportunity analysis...</div>;
  }

  const { opportunityAnalysis } = analysisData;
  const opportunities = comparisonMode ? opportunityAnalysis.highValueTargets : opportunityAnalysis.highValueTargets;
  const additionalOpportunities = comparisonMode ? opportunityAnalysis.emergingOpportunities : opportunityAnalysis.undervaluedAreas;

  return (
    <div>
      <h3>🎯 Growth Opportunities</h3>
      
      {/* Opportunity Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '25px' }}>
        <div style={{ background: '#d4edda', padding: '15px', borderRadius: '6px', textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#155724' }}>{opportunities?.length || 0}</div>
          <div style={{ fontSize: '12px', color: '#155724' }}>High-Value Targets</div>
        </div>
        <div style={{ background: '#cce5ff', padding: '15px', borderRadius: '6px', textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#004085' }}>{additionalOpportunities?.length || 0}</div>
          <div style={{ fontSize: '12px', color: '#004085' }}>{comparisonMode ? 'Emerging Opportunities' : 'Undervalued Areas'}</div>
        </div>
        <div style={{ background: '#fff3cd', padding: '15px', borderRadius: '6px', textAlign: 'center' }}>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#856404', textTransform: 'capitalize' }}>{opportunityAnalysis.growthPotential}</div>
          <div style={{ fontSize: '12px', color: '#856404' }}>Growth Potential</div>
        </div>
      </div>

      {/* High-Value Opportunities */}
      {opportunities && opportunities.length > 0 && (
        <div style={{ marginBottom: '25px' }}>
          <h4>⭐ Top Opportunities</h4>
          <div style={{ maxHeight: '250px', overflowY: 'auto', border: '1px solid #dee2e6', borderRadius: '4px' }}>
            <table style={{ width: '100%', fontSize: '14px' }}>
              <thead style={{ background: '#f8f9fa', position: 'sticky', top: 0 }}>
                <tr>
                  <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Location</th>
                  <th style={{ padding: '10px', textAlign: 'center', borderBottom: '1px solid #dee2e6' }}>Rank</th>
                  <th style={{ padding: '10px', textAlign: 'right', borderBottom: '1px solid #dee2e6' }}>Population</th>
                  {comparisonMode && <th style={{ padding: '10px', textAlign: 'center', borderBottom: '1px solid #dee2e6' }}>Improvement</th>}
                  <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #dee2e6' }}>Reason</th>
                </tr>
              </thead>
              <tbody>
                {opportunities.slice(0, 10).map((opp, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid #f8f9fa' }}>
                    <td style={{ padding: '8px 10px' }}>{opp.oa}</td>
                    <td style={{ padding: '8px 10px', textAlign: 'center' }}>{comparisonMode ? opp.week2Rank : opp.rank}</td>
                    <td style={{ padding: '8px 10px', textAlign: 'right' }}>{(opp.population || 0).toLocaleString()}</td>
                    {comparisonMode && (
                      <td style={{ padding: '8px 10px', textAlign: 'center' }}>
                        <span style={{ color: '#28a745', fontWeight: 'bold' }}>+{opp.rankImprovement}</span>
                      </td>
                    )}
                    <td style={{ padding: '8px 10px', fontSize: '13px' }}>{opp.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Additional Opportunities */}
      {additionalOpportunities && additionalOpportunities.length > 0 && (
        <div>
          <h4>💡 {comparisonMode ? 'Emerging Opportunities' : 'Undervalued Areas'}</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '15px' }}>
            {additionalOpportunities.slice(0, 6).map((opp, index) => (
              <div key={index} style={{ background: '#f8f9fa', padding: '15px', borderRadius: '6px', border: '1px solid #dee2e6' }}>
                <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>{opp.oa}</div>
                <div style={{ fontSize: '13px', color: '#666' }}>
                  {comparisonMode ? `New Rank: ${opp.week2Rank}` : `Rank: ${opp.rank}`}<br/>
                  Population: {(opp.population || 0).toLocaleString()}<br/>
                  {!comparisonMode && `Distance: ${opp.distance?.toFixed(2)}km`}
                </div>
                <div style={{ fontSize: '12px', marginTop: '8px', fontStyle: 'italic' }}>{opp.reason}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {(!opportunities || opportunities.length === 0) && (!additionalOpportunities || additionalOpportunities.length === 0) && (
        <div style={{ background: '#fff3cd', color: '#856404', padding: '20px', borderRadius: '4px', textAlign: 'center' }}>
          <strong>📊 Analysis Complete</strong><br/>
          Current optimization appears well-balanced. Monitor for changes in competitor landscape.
        </div>
      )}
    </div>
  );
};

const RecommendationsTab = ({ analysisData, comparisonMode, results }) => {
  if (!analysisData?.recommendations) {
    return <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>Generating strategic recommendations...</div>;
  }

  const { recommendations } = analysisData;
  const priorityColor = recommendations.priority === 'high' ? '#dc3545' : recommendations.priority === 'medium' ? '#ffc107' : '#28a745';

  return (
    <div>
      <h3>💡 Strategic Recommendations</h3>
      
      {/* Priority Indicator */}
      <div style={{ 
        background: priorityColor, 
        color: 'white', 
        padding: '10px 20px', 
        borderRadius: '6px', 
        marginBottom: '20px',
        textAlign: 'center',
        fontWeight: 'bold',
        textTransform: 'uppercase'
      }}>
        {recommendations.priority} Priority Action Required
      </div>

      {/* Immediate Actions */}
      {recommendations.immediate && recommendations.immediate.length > 0 && (
        <div style={{ marginBottom: '25px' }}>
          <h4 style={{ color: '#dc3545' }}>🚨 Immediate Actions</h4>
          {recommendations.immediate.map((rec, index) => (
            <div key={index} style={{ 
              background: '#f8d7da', 
              border: '1px solid #f5c6cb', 
              padding: '20px', 
              borderRadius: '6px', 
              marginBottom: '15px' 
            }}>
              <h5 style={{ margin: '0 0 10px 0', color: '#721c24' }}>{rec.title}</h5>
              <p style={{ margin: '0 0 10px 0', color: '#721c24' }}>{rec.description}</p>
              <div style={{ 
                background: '#721c24', 
                color: 'white', 
                padding: '8px 15px', 
                borderRadius: '4px', 
                fontSize: '14px',
                fontWeight: 'bold'
              }}>
                Action: {rec.action}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Strategic Actions */}
      {recommendations.strategic && recommendations.strategic.length > 0 && (
        <div style={{ marginBottom: '25px' }}>
          <h4 style={{ color: '#007bff' }}>📋 Strategic Planning</h4>
          {recommendations.strategic.map((rec, index) => (
            <div key={index} style={{ 
              background: '#cce5ff', 
              border: '1px solid #b3d7ff', 
              padding: '20px', 
              borderRadius: '6px', 
              marginBottom: '15px' 
            }}>
              <h5 style={{ margin: '0 0 10px 0', color: '#004085' }}>{rec.title}</h5>
              <p style={{ margin: '0 0 10px 0', color: '#004085' }}>{rec.description}</p>
              <div style={{ 
                background: '#004085', 
                color: 'white', 
                padding: '8px 15px', 
                borderRadius: '4px', 
                fontSize: '14px',
                fontWeight: 'bold'
              }}>
                Strategy: {rec.action}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Monitoring Actions */}
      {recommendations.monitoring && recommendations.monitoring.length > 0 && (
        <div>
          <h4 style={{ color: '#28a745' }}>📊 Ongoing Monitoring</h4>
          {recommendations.monitoring.map((rec, index) => (
            <div key={index} style={{ 
              background: '#d4edda', 
              border: '1px solid #c3e6cb', 
              padding: '20px', 
              borderRadius: '6px', 
              marginBottom: '15px' 
            }}>
              <h5 style={{ margin: '0 0 10px 0', color: '#155724' }}>{rec.title}</h5>
              <p style={{ margin: '0 0 10px 0', color: '#155724' }}>{rec.description}</p>
              <div style={{ 
                background: '#155724', 
                color: 'white', 
                padding: '8px 15px', 
                borderRadius: '4px', 
                fontSize: '14px',
                fontWeight: 'bold'
              }}>
                Monitor: {rec.action}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Summary */}
      <div style={{ 
        background: '#f8f9fa', 
        padding: '20px', 
        borderRadius: '6px', 
        marginTop: '20px',
        border: '1px solid #dee2e6'
      }}>
        <h5 style={{ margin: '0 0 10px 0' }}>📈 Next Steps Summary</h5>
        <ul style={{ margin: '0', paddingLeft: '20px', fontSize: '14px' }}>
          <li>Review and implement immediate actions with {recommendations.priority} priority</li>
          <li>Plan strategic initiatives for medium-term execution</li>
          <li>Establish monitoring cadence for ongoing optimization</li>
          <li>Schedule next analysis session after implementing changes</li>
        </ul>
      </div>
    </div>
  );
};

export default SenseCheckingTools;
