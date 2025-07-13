const _ = require('lodash');

class OptimizationService {
  constructor() {
    this.EARTH_RADIUS_KM = 6371;
  }


  calculateDistance(lat1, lon1, lat2, lon2) {
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return this.EARTH_RADIUS_KM * c;
  }

  toRadians(degrees) {
    return degrees * (Math.PI / 180);
  }


  findMinDistanceToCompetitors(lat, lng, competitors) {
    if (competitors.length === 0) {
      return Infinity;
    }
    
    let minDistance = Infinity;
    for (const competitor of competitors) {
      const distance = this.calculateDistance(lat, lng, competitor.latitude, competitor.longitude);
      minDistance = Math.min(minDistance, distance);
    }
    return minDistance;
  }


  calculateLocationScore(populationArea, competitors, weights = { population: 0.6, distance: 0.4 }) {
    const { latitude, longitude, population } = populationArea;
    

    const populationScore = Math.log(population + 1);
    

    const minDistance = this.findMinDistanceToCompetitors(latitude, longitude, competitors);
    const distanceScore = Math.min(minDistance, 50);
    

    const totalScore = (weights.population * populationScore) + (weights.distance * distanceScore);
    
    return {
      totalScore,
      populationScore,
      distanceScore: minDistance,
      population,
      location: { latitude, longitude }
    };
  }


  optimizeLocations(populationAreas, competitors, maxLocations = 500) {
    console.log(`Starting optimization for ${populationAreas.length} areas against ${competitors.length} competitors`);
    
    if (populationAreas.length === 0) {
      throw new Error('No population areas provided');
    }


    const scoredAreas = populationAreas.map(area => ({
      ...area,
      ...this.calculateLocationScore(area, competitors)
    }));


    const sortedAreas = _.orderBy(scoredAreas, ['totalScore'], ['desc']);


    const selectedLocations = sortedAreas.slice(0, Math.min(maxLocations, sortedAreas.length));


    const clusteredLocations = this.applyGeographicClustering(selectedLocations, maxLocations);


    const summary = this.generateOptimizationSummary(clusteredLocations, competitors);

    return {
      locations: clusteredLocations,
      summary,
      totalSelected: clusteredLocations.length,
      maxRequested: maxLocations,
      optimization: {
        algorithm: 'balanced_population_distance',
        weights: { population: 0.6, distance: 0.4 },
        competitorsAnalyzed: competitors.length,
        areasEvaluated: populationAreas.length
      }
    };
  }


  applyGeographicClustering(locations, maxLocations, minDistanceBetweenLocations = 2) {
    if (locations.length <= maxLocations) {
      return locations;
    }

    const clusteredLocations = [];
    const usedIndices = new Set();


    for (let i = 0; i < locations.length && clusteredLocations.length < maxLocations; i++) {
      if (usedIndices.has(i)) {
        continue;
      }

      const candidate = locations[i];
      let tooClose = false;


      for (const selected of clusteredLocations) {
        const distance = this.calculateDistance(
          candidate.latitude, candidate.longitude,
          selected.latitude, selected.longitude
        );
        
        if (distance < minDistanceBetweenLocations) {
          tooClose = true;
          break;
        }
      }

      if (!tooClose) {
        clusteredLocations.push(candidate);
        usedIndices.add(i);
      }
    }

    console.log(`Applied clustering: ${locations.length} -> ${clusteredLocations.length} locations`);
    return clusteredLocations;
  }


  generateOptimizationSummary(selectedLocations, competitors) {
    if (selectedLocations.length === 0) {
      return { error: 'No locations selected' };
    }

    const totalPopulation = selectedLocations.reduce((sum, loc) => sum + loc.population, 0);
    const avgPopulation = totalPopulation / selectedLocations.length;
    
    const distances = selectedLocations.map(loc => loc.distanceScore);
    const avgDistance = distances.reduce((sum, d) => sum + d, 0) / distances.length;
    const minDistance = Math.min(...distances);
    
    const scores = selectedLocations.map(loc => loc.totalScore);
    const avgScore = scores.reduce((sum, s) => sum + s, 0) / scores.length;
    
    return {
      totalPopulationCovered: totalPopulation,
      averagePopulationPerLocation: Math.round(avgPopulation),
      averageDistanceToNearestCompetitor: Math.round(avgDistance * 100) / 100,
      minimumDistanceToCompetitor: Math.round(minDistance * 100) / 100,
      averageOptimizationScore: Math.round(avgScore * 100) / 100,
      geographicSpread: this.calculateGeographicSpread(selectedLocations)
    };
  }


  calculateGeographicSpread(locations) {
    if (locations.length === 0) {
      return 0;
    }
    
    const lats = locations.map(l => l.latitude);
    const lngs = locations.map(l => l.longitude);
    
    const latSpread = Math.max(...lats) - Math.min(...lats);
    const lngSpread = Math.max(...lngs) - Math.min(...lngs);
    
    return {
      latitudeSpread: Math.round(latSpread * 1000) / 1000,
      longitudeSpread: Math.round(lngSpread * 1000) / 1000,
      coverage: Math.round((latSpread * lngSpread) * 10000) / 10000
    };
  }


  compareOptimizations(week1Result, week2Result) {
    return {
      populationDifference: week2Result.summary.totalPopulationCovered - week1Result.summary.totalPopulationCovered,
      averageDistanceDifference: week2Result.summary.averageDistanceToNearestCompetitor - week1Result.summary.averageDistanceToNearestCompetitor,
      locationCountDifference: week2Result.totalSelected - week1Result.totalSelected,
      scoreDifference: week2Result.summary.averageOptimizationScore - week1Result.summary.averageOptimizationScore
    };
  }
}

module.exports = new OptimizationService();
