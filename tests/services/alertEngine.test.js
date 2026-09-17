import { generateSystemAlerts } from '../../services/alertEngine';

describe('Alert Engine', () => {

  test('generates HIGH PM2.5 alert when reading is 55 or above', () => {

    const pm25Data = {
      items: [
        {
          readings: {
            pm25_one_hourly: {
              central: 60
            }
          }
        }
      ]
    };

    const alerts = generateSystemAlerts(pm25Data, null);

    expect(alerts).toHaveLength(1);
    expect(alerts[0].type).toBe('pm25');
    expect(alerts[0].severity).toBe('HIGH');
    expect(alerts[0].title).toContain('Hazardous Air Quality');
    expect(alerts[0].actions).toContain('Wear N95 mask');
  });


  test('generates MODERATE PM2.5 alert between 35 and 54', () => {

    const pm25Data = {
      items: [
        {
          readings: {
            pm25_one_hourly: {
              central: 40
            }
          }
        }
      ]
    };

    const alerts = generateSystemAlerts(pm25Data, null);

    expect(alerts[0].severity).toBe('MODERATE');
    expect(alerts[0].actions).toContain(
      'Reduce prolonged outdoor activity'
    );
  });


  test('generates LOW PM2.5 alert below 35', () => {

    const pm25Data = {
      items: [
        {
          readings: {
            pm25_one_hourly: {
              central: 20
            }
          }
        }
      ]
    };

    const alerts = generateSystemAlerts(pm25Data, null);

    expect(alerts[0].severity).toBe('LOW');
    expect(alerts[0].title).toContain('Air Quality Safe');
  });


  test('generates HIGH heat alert at 35 degrees Celsius', () => {

    const meteoData = {
      daily: {
        temperature_2m_max: [35],
        precipitation_sum: [0]
      }
    };

    const alerts = generateSystemAlerts(null, meteoData);

    expect(alerts).toHaveLength(1);
    expect(alerts[0].type).toBe('climate_heat');
    expect(alerts[0].severity).toBe('HIGH');
    expect(alerts[0].title).toContain('Extreme Heat Warning');
  });


  test('generates MODERATE heat alert between 33 and 34 degrees', () => {

    const meteoData = {
      daily: {
        temperature_2m_max: [34],
        precipitation_sum: [0]
      }
    };

    const alerts = generateSystemAlerts(null, meteoData);

    expect(alerts[0].severity).toBe('MODERATE');
    expect(alerts[0].title).toContain('Elevated Temperatures');
  });


  test('generates flash flood alert when rainfall reaches 50mm', () => {

    const meteoData = {
      daily: {
        temperature_2m_max: [30],
        precipitation_sum: [50]
      }
    };

    const alerts = generateSystemAlerts(null, meteoData);

    expect(alerts[0].type).toBe('climate_flood');
    expect(alerts[0].severity).toBe('HIGH');
    expect(alerts[0].title).toContain('Flash Flood');
  });


  test('generates multiple alerts when multiple hazards occur', () => {

    const pm25Data = {
      items: [
        {
          readings: {
            pm25_one_hourly: {
              central: 60
            }
          }
        }
      ]
    };

    const meteoData = {
      daily: {
        temperature_2m_max: [36],
        precipitation_sum: [60]
      }
    };

    const alerts = generateSystemAlerts(pm25Data, meteoData);

    expect(alerts).toHaveLength(3);

    expect(alerts.map(alert => alert.type)).toEqual(
      expect.arrayContaining([
        'pm25',
        'climate_heat',
        'climate_flood'
      ])
    );
  });


  test('returns empty array when no environmental data is available', () => {

    const alerts = generateSystemAlerts(null, null);

    expect(alerts).toEqual([]);
  });

});