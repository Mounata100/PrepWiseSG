import { fetchPM25Data } from '../../services/NEAAPI';

describe('NEA PM2.5 API Service', () => {

  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('successfully retrieves PM2.5 data from NEA API', async () => {

    const mockResponse = {
      data: {
        items: [
          {
            timestamp: '2026-08-19T12:00:00+08:00',
            readings: {
              pm25_one_hourly: {
                north: 20,
                south: 25,
                east: 30,
                west: 22,
                central: 28
              }
            }
          }
        ]
      }
    };

    fetch.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockResponse)
    });

    const result = await fetchPM25Data();

    expect(fetch).toHaveBeenCalledTimes(1);

    expect(fetch).toHaveBeenCalledWith(
      'https://api-open.data.gov.sg/v2/real-time/api/pm25'
    );

    expect(result).toEqual(mockResponse.data);
  });


  test('returns null when NEA API returns an HTTP error', async () => {

    fetch.mockResolvedValue({
      ok: false
    });

    const result = await fetchPM25Data();

    expect(result).toBeNull();

    expect(fetch).toHaveBeenCalledTimes(1);
  });


  test('returns null when network request fails', async () => {

    fetch.mockRejectedValue(
      new Error('Network connection failed')
    );

    const result = await fetchPM25Data();

    expect(result).toBeNull();

    expect(fetch).toHaveBeenCalledTimes(1);
  });


  test('returns null when API response cannot be parsed', async () => {

    fetch.mockResolvedValue({
      ok: true,
      json: jest.fn().mockRejectedValue(
        new Error('Invalid JSON')
      )
    });

    const result = await fetchPM25Data();

    expect(result).toBeNull();
  });


  test('correctly returns the API data structure', async () => {

    const mockData = {
      items: [
        {
          timestamp: '2026-08-19T12:00:00+08:00',
          readings: {
            pm25_one_hourly: {
              north: 15,
              south: 18,
              east: 21,
              west: 17,
              central: 19
            }
          }
        }
      ]
    };

    fetch.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({
        data: mockData
      })
    });

    const result = await fetchPM25Data();

    expect(result).toEqual(mockData);

    expect(result.items[0].readings.pm25_one_hourly.north)
      .toBe(15);

    expect(result.items[0].readings.pm25_one_hourly.central)
      .toBe(19);
  });

});