export function generateSystemAlerts(pm25Data, meteoData) {
  const alerts = [];
  const uniqueTimestampId = Date.now();

  // ==========================================
  // 1. PROCESS NEA PM2.5 HAZARD DATA
  // ==========================================
  if (pm25Data && pm25Data.items && pm25Data.items[0]) {
    const latestItem = pm25Data.items[0];
    const readings = latestItem.readings.pm25_one_hourly;

    Object.entries(readings).forEach(([region, value]) => {
      let severity = 'LOW';
      let actions = ['Normal outdoor activities'];
      let title = '✅ Air Quality Safe';

      if (value >= 55) {
        severity = 'HIGH';
        title = '🚨 Hazardous Air Quality';
        actions = ['Wear N95 mask', 'Stay indoors', 'Avoid outdoor exercise'];
      } else if (value >= 35) {
        severity = 'MODERATE';
        title = '⚠️ Moderate Air Pollution';
        actions = ['Reduce prolonged outdoor activity'];
      }

      alerts.push({
        id: `pm25-${region}-${uniqueTimestampId}`,
        type: 'pm25',
        title,
        message: `PM2.5 reading: ${value} µg/m³`,
        location: region.toUpperCase(),
        severity,
        timestamp: new Date(),
        actions,
      });
    });
  }

  // ==========================================
  // 2. PROCESS OPEN-METEO CLIMATE/WEATHER DATA
  // ==========================================
  if (meteoData && meteoData.daily) {
    // Index 0 represents today's live forecasted parameters
    const maxTempToday = meteoData.daily.temperature_2m_max[0];
    const rainSumToday = meteoData.daily.precipitation_sum[0];

    // Check for Heatwave Thresholds
    if (maxTempToday >= 35) {
      alerts.push({
        id: `heatwave-${uniqueTimestampId}`,
        type: 'climate_heat',
        title: '🔥 Extreme Heat Warning',
        message: `High thermal threshold risk reached at ${maxTempToday}°C.`,
        location: 'SINGAPORE REGION',
        severity: 'HIGH',
        timestamp: new Date(),
        actions: ['Minimize direct sun exposure', 'Hydrate immediately', 'Monitor wet-bulb indicators'],
      });
    } else if (maxTempToday >= 33) {
      alerts.push({
        id: `heat-moderate-${uniqueTimestampId}`,
        type: 'climate_heat',
        title: '⚠️ Elevated Temperatures',
        message: `Mid-tier thermal load active at ${maxTempToday}°C.`,
        location: 'SINGAPORE REGION',
        severity: 'MODERATE',
        actions: ['Seek shaded canopy vectors', 'Maintain baseline water intake'],
      });
    }

    // Check for Flash Flood Heavy Rainfall Thresholds
    if (rainSumToday >= 50) { // 50mm+ denotes heavy continuous torrential downpour rain
      alerts.push({
        id: `flood-${uniqueTimestampId}`,
        type: 'climate_flood',
        title: '🌊 Flash Flood Threat Vector',
        message: `Torrential accumulation expected: ${rainSumToday} mm.`,
        location: 'LOW LYING SECTORS',
        severity: 'HIGH',
        timestamp: new Date(),
        actions: ['Avoid low terrain drainage links', 'Move critical gear above baseline floors'],
      });
    }
  }

  return alerts;
}