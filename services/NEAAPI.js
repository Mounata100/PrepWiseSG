const PM25_API = 'https://api-open.data.gov.sg/v2/real-time/api/pm25';

export async function fetchPM25Data() {
  try {

    const response = await fetch(PM25_API);

    if (!response.ok) {
      throw new Error('Failed to fetch PM2.5 data');
    }

    const json = await response.json();

    return json.data;

  } catch (error) {

    console.error('PM2.5 API Error:', error);

    return null;
  }
}