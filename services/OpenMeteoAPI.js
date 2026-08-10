const OPEN_METEO_API = 
  'https://api.open-meteo.com/v1/forecast?latitude=1.3521&longitude=103.8198&daily=temperature_2m_max,precipitation_sum&timezone=Asia%2FSingapore';

export async function fetchOpenMeteoData() {
  try {
    const response = await fetch(OPEN_METEO_API);
    if (!response.ok) {
      throw new Error('Failed to fetch Open-Meteo data');
    }
    const json = await response.json();
    return json;
  } catch (error) {
    console.error('Open-Meteo API Error:', error);
    return null;
  }
}