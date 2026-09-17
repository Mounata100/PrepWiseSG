import { fetchOpenMeteoData } from '../../services/OpenMeteoAPI';

describe('Open-Meteo API Service', () => {

  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('successfully retrieves weather forecast data', async () => {

    const mockResponse = {
      daily: {
        time: ['2026-08-19'],
        temperature_2m_max: [34.5],
        precipitation_sum: [12.4]
      }
    };

    fetch.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockResponse)
    });

    const result = await fetchOpenMeteoData();

    expect(fetch).toHaveBeenCalledTimes(1);

    expect(fetch).toHaveBeenCalledWith(
      'https://api.open-meteo.com/v1/forecast?latitude=1.3521&longitude=103.8198&daily=temperature_2m_max,precipitation_sum&timezone=Asia%2FSingapore'
    );

    expect(result).toEqual(mockResponse);
  });


  test('returns temperature forecast correctly', async () => {

    const mockResponse = {
      daily: {
        time: ['2026-08-19'],
        temperature_2m_max: [35],
        precipitation_sum: [5]
      }
    };

    fetch.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockResponse)
    });

    const result = await fetchOpenMeteoData();

    expect(result.daily.temperature_2m_max[0])
      .toBe(35);
  });


  test('returns rainfall data correctly', async () => {

    const mockResponse = {
      daily: {
        time: ['2026-08-19'],
        temperature_2m_max: [30],
        precipitation_sum: [50]
      }
    };

    fetch.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockResponse)
    });

    const result = await fetchOpenMeteoData();

    expect(result.daily.precipitation_sum[0])
      .toBe(50);
  });


  test('returns null when Open-Meteo returns HTTP error', async () => {

    fetch.mockResolvedValue({
      ok: false
    });

    const result = await fetchOpenMeteoData();

    expect(result).toBeNull();
  });


  test('returns null when network request fails', async () => {

    fetch.mockRejectedValue(
      new Error('Network connection failed')
    );

    const result = await fetchOpenMeteoData();

    expect(result).toBeNull();
  });


  test('returns null when response JSON cannot be parsed', async () => {

    fetch.mockResolvedValue({
      ok: true,
      json: jest.fn().mockRejectedValue(
        new Error('Invalid JSON')
      )
    });

    const result = await fetchOpenMeteoData();

    expect(result).toBeNull();
  });

});