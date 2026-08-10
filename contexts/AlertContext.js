import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as Location from 'expo-location';

const AlertContext = createContext();

export const AlertContextProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [localCoordinates, setLocalCoordinates] = useState(null);
  
  const [pm25Details, setPm25Details] = useState({ value: 12, status: 'Good', color: '#10B981' });
  const [weatherDetails, setWeatherDetails] = useState({ currentTemp: 28, forecast: [] });
  const [floodDetails, setFloodDetails] = useState({ riverDischarge: 1.2, floodRisk: 'Safe Operational Levels', color: '#10B981' });

  const fetchLocalisedTelemetry = useCallback(async () => {
    setLoading(true);
    let lat = 1.3521; // Singapore default center fallback
    let lon = 103.8198;

    try {
      // 1. Safe Permission & Service Check
    const servicesEnabled = await Location.hasServicesEnabledAsync();
    if (!servicesEnabled) {
      console.warn("Location services (GPS) disabled on device.");
    } else {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        let location = null;
        try {
          location = await Promise.race([
            Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced }),
            new Promise((_, reject) => setTimeout(() => reject(new Error('Location timeout')), 8000))
          ]);
        } catch (timeoutErr) {
          console.warn("Fresh GPS lock timed out. Retrieving last known location...");
          location = await Location.getLastKnownPositionAsync({});
        }

        if (location?.coords) {
          lat = location.coords.latitude;
          lon = location.coords.longitude;
          setLocalCoordinates({ lat, lon });
        }
      }
    }
  } catch (locError) {
    console.warn("Location acquisition failed:", locError.message);
    //   // 1. Safe Permission Check
    //   const { status } = await Location.requestForegroundPermissionsAsync();
    //   if (status === 'granted') {
    //     // Use a fast timeout so the location request doesn't hang forever indoors
    //     const location = await Promise.race([
    //       //Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced }),
    //       Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Lowest }),
    //       new Promise((_, reject) => setTimeout(() => reject(new Error('Location timeout')), 4000))
    //     ]);
    //     lat = location.coords.latitude;
    //     lon = location.coords.longitude;
    //     setLocalCoordinates({ lat, lon });
    //   } else {
    //     console.warn("Location permission denied. Utilizing Singapore regional baseline matrix.");
    //   }
    // } catch (locError) {
    //   console.warn("Location acquisition bypassed, tracking fallback coords:", locError.message);
     }


    // 2. Isolated Pipeline Fetches (One failing won't kill the others)
    
    // --- WEATHER PIPELINE ---
    try {
      const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m&daily=temperature_2m_max,temperature_2m_min&forecast_days=3&timezone=Asia%2FSingapore`);
      const weatherData = await weatherRes.json();
      
      if (weatherData?.current) {
        const forecastData = weatherData.daily.time.map((date, idx) => ({
          date,
          max: weatherData.daily.temperature_2m_max[idx],
          min: weatherData.daily.temperature_2m_min[idx],
        }));
        setWeatherDetails({
          currentTemp: weatherData.current.temperature_2m,
          forecast: forecastData
        });
      }
    } catch (err) {
      console.error("Weather data sync failed:", err);
      // Fallback UI generation if endpoint drops out
      setWeatherDetails({
        currentTemp: 29.5,
        forecast: [
          { date: 'Today', max: 32, min: 26 },
          { date: 'Tomorrow', max: 31, min: 25 },
          { date: 'Next Day', max: 33, min: 26 }
        ]
      });
    }

    // --- FLOOD PIPELINE ---
    try {
      const floodRes = await fetch(`https://flood-api.open-meteo.com/v1/flood?latitude=${lat}&longitude=${lon}&daily=river_discharge&forecast_days=3`);
      const floodData = await floodRes.json();
      
      const localDischarge = floodData?.daily?.river_discharge?.[0] || 0.8;
      let riskText = 'Safe (Normal Baseline)';
      let riskColor = '#10B981';

      if (localDischarge > 10.0) {
        riskText = 'Critical Flash Flood Threat Vector Active';
        riskColor = '#EF4444';
      } else if (localDischarge > 4.0) {
        riskText = 'Elevated Flow Level - Monitor Runoffs';
        riskColor = '#F59E0B';
      }
      setFloodDetails({ riverDischarge: localDischarge, floodRisk: riskText, color: riskColor });
    } catch (err) {
      console.error("Flood API failed:", err);
      setFloodDetails({ riverDischarge: 0.4, floodRisk: 'Safe Operational Levels (Fallback Mode)', color: '#10B981' });
    }

    // --- NEA PM2.5 PIPELINE ---
    // try {
    //   const pm25Res = await fetch('https://api-open.data.gov.sg/v2/real-time/api/pm25');
      
    //   if (!pm25Res.ok) {
    //     throw new Error(`NEA Server responded with status: ${pm25Res.status}`);
    //   }
      
    //   const jsonResponse = await pm25Res.json();
      
    //   // According to your exact schema snippet: jsonResponse.data.items[0].readings.pm25_one_hourly
    //   const targetData = jsonResponse?.data;
    //   const dataItems = targetData?.items || [];
      
    //   let standardValue = null;

    //   if (dataItems.length > 0 && dataItems[0]?.readings) {
    //     const hourlyReadings = dataItems[0].readings.pm25_one_hourly;
        
    //     if (hourlyReadings) {
    //       // Grabs central, or falls back to whichever region responds first (east, west, etc.)
    //       standardValue = hourlyReadings.central || Object.values(hourlyReadings)[0];
    //     }
    //   }

    //   // Safe numeric check fallback
    //   if (standardValue === undefined || standardValue === null) {
    //     console.warn("Unable to parse PM2.5 readings. Using baseline.");
    //     standardValue = 12; 
    //   }
      
    //   // Determine environmental metrics mapping
    //   let pmStatus = 'Good';
    //   let pmColor = '#10B981';
    //   const numericVal = Number(standardValue);
      
    //   if (numericVal >= 55) { 
    //     pmStatus = 'Hazardous'; 
    //     pmColor = '#EF4444'; 
    //   } else if (numericVal >= 35) { 
    //     pmStatus = 'Moderate'; 
    //     pmColor = '#F59E0B'; 
    //   }

    //   setPm25Details({ 
    //     value: numericVal, 
    //     status: pmStatus, 
    //     color: pmColor 
    //   });
      
    // } catch (err) {
    //   console.error("NEA PM2.5 extraction pipeline failed:", err);
    //   setPm25Details({ value: 14, status: 'Healthy (System Normal)', color: '#10B981' });
    // }

    // --- NEA PM2.5 PIPELINE ---
    try {
      const pm25Res = await fetch('https://api-open.data.gov.sg/v2/real-time/api/pm25');
      
      if (!pm25Res.ok) {
        throw new Error(`NEA Server responded with status: ${pm25Res.status}`);
      }
      
      const jsonResponse = await pm25Res.json();
      const items = jsonResponse?.data?.items;
      
      let standardValue = null;

      if (Array.isArray(items) && items.length > 0) {
        const readingsObj = items[0]?.readings?.pm25_one_hourly;
        if (readingsObj) {
          // Extract central region reading or fall back to the first available regional key value
          standardValue = readingsObj.central ?? Object.values(readingsObj)[0];
        }
      }

      const numericVal = Number(standardValue);
      const finalPmValue = !isNaN(numericVal) ? numericVal : 12;
      
      let pmStatus = 'Good';
      let pmColor = '#10B981';
      
      if (finalPmValue >= 55) { 
        pmStatus = 'Hazardous'; 
        pmColor = '#EF4444'; 
      } else if (finalPmValue >= 35) { 
        pmStatus = 'Moderate'; 
        pmColor = '#F59E0B'; 
      }

      setPm25Details({ 
        value: finalPmValue, 
        status: pmStatus, 
        color: pmColor 
      });
      
    } catch (err) {
      console.error("NEA PM2.5 extraction pipeline failed:", err);
      setPm25Details({ value: 12, status: 'Good (Fallback Mode)', color: '#10B981' });
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    fetchLocalisedTelemetry();
    const cycleInterval = setInterval(fetchLocalisedTelemetry, 300000);
    return () => clearInterval(cycleInterval);
  }, [fetchLocalisedTelemetry]);

  return (
    <AlertContext.Provider value={{ loading, pm25Details, weatherDetails, floodDetails, fetchLocalisedTelemetry }}>
      {children}
    </AlertContext.Provider>
  );
};

export const useAlerts = () => useContext(AlertContext);