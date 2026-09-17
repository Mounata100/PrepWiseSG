import React from 'react';
import TestRenderer, { act } from 'react-test-renderer';

import {
  AlertContextProvider,
  useAlerts,
} from '../../contexts/AlertContext';

import * as Location from 'expo-location';

jest.mock('expo-location', () => ({
  hasServicesEnabledAsync: jest.fn(),
  requestForegroundPermissionsAsync: jest.fn(),
  getCurrentPositionAsync: jest.fn(),
  getLastKnownPositionAsync: jest.fn(),
  Accuracy: {
    Balanced: 1,
  },
}));


// --------------------------------------------------
// Test component used to access the AlertContext
// --------------------------------------------------

let contextValue;

function TestConsumer() {
  contextValue = useAlerts();

  return null;
}


// --------------------------------------------------
// Tests
// --------------------------------------------------

describe('AlertContext Integration', () => {

  beforeEach(() => {

    jest.clearAllMocks();

    global.fetch = jest.fn();

    Location.hasServicesEnabledAsync.mockResolvedValue(true);

    Location.requestForegroundPermissionsAsync.mockResolvedValue({
      status: 'granted',
    });

    Location.getCurrentPositionAsync.mockResolvedValue({
      coords: {
        latitude: 1.3521,
        longitude: 103.8198,
      },
    });

  });


  afterEach(() => {
    jest.restoreAllMocks();
  });


  test('provides the AlertContext values', async () => {

    global.fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          current: {
            temperature_2m: 30,
          },
          daily: {
            time: ['2026-08-19'],
            temperature_2m_max: [32],
            temperature_2m_min: [26],
          },
        }),
      })

      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          daily: {
            river_discharge: [2],
          },
        }),
      })

      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: {
            items: [
              {
                readings: {
                  pm25_one_hourly: {
                    central: 20,
                  },
                },
              },
            ],
          },
        }),
      });


    await act(async () => {

      TestRenderer.create(
        <AlertContextProvider>
          <TestConsumer />
        </AlertContextProvider>
      );

    });


    expect(contextValue).toBeDefined();

    expect(contextValue).toHaveProperty('loading');
    expect(contextValue).toHaveProperty('pm25Details');
    expect(contextValue).toHaveProperty('weatherDetails');
    expect(contextValue).toHaveProperty('floodDetails');
    expect(contextValue).toHaveProperty(
      'fetchLocalisedTelemetry'
    );

  });


  test('processes weather data from Open-Meteo', async () => {

    global.fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          current: {
            temperature_2m: 31,
          },
          daily: {
            time: [
              '2026-08-19',
              '2026-08-20',
              '2026-08-21',
            ],
            temperature_2m_max: [
              33,
              32,
              34,
            ],
            temperature_2m_min: [
              27,
              26,
              27,
            ],
          },
        }),
      })

      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          daily: {
            river_discharge: [2.5],
          },
        }),
      })

      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: {
            items: [
              {
                readings: {
                  pm25_one_hourly: {
                    central: 20,
                  },
                },
              },
            ],
          },
        }),
      });


    await act(async () => {

      TestRenderer.create(
        <AlertContextProvider>
          <TestConsumer />
        </AlertContextProvider>
      );

    });


    expect(contextValue.weatherDetails.currentTemp)
      .toBe(31);

    expect(contextValue.weatherDetails.forecast)
      .toHaveLength(3);

    expect(contextValue.weatherDetails.forecast[0])
      .toEqual({
        date: '2026-08-19',
        max: 33,
        min: 27,
      });

  });


  test('processes flood API data', async () => {

    global.fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          current: {
            temperature_2m: 30,
          },
          daily: {
            time: ['2026-08-19'],
            temperature_2m_max: [32],
            temperature_2m_min: [26],
          },
        }),
      })

      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          daily: {
            river_discharge: [12],
          },
        }),
      })

      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: {
            items: [
              {
                readings: {
                  pm25_one_hourly: {
                    central: 20,
                  },
                },
              },
            ],
          },
        }),
      });


    await act(async () => {

      TestRenderer.create(
        <AlertContextProvider>
          <TestConsumer />
        </AlertContextProvider>
      );

    });


    expect(contextValue.floodDetails.riverDischarge)
      .toBe(12);

    expect(contextValue.floodDetails.floodRisk)
      .toBe('Critical Flash Flood Threat Vector Active');

    expect(contextValue.floodDetails.color)
      .toBe('#EF4444');

  });


  test('processes NEA PM2.5 data', async () => {

    global.fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          current: {
            temperature_2m: 30,
          },
          daily: {
            time: ['2026-08-19'],
            temperature_2m_max: [32],
            temperature_2m_min: [26],
          },
        }),
      })

      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          daily: {
            river_discharge: [2],
          },
        }),
      })

      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: {
            items: [
              {
                readings: {
                  pm25_one_hourly: {
                    central: 60,
                  },
                },
              },
            ],
          },
        }),
      });


    await act(async () => {

      TestRenderer.create(
        <AlertContextProvider>
          <TestConsumer />
        </AlertContextProvider>
      );

    });


    expect(contextValue.pm25Details.value)
      .toBe(60);

    expect(contextValue.pm25Details.status)
      .toBe('Hazardous');

    expect(contextValue.pm25Details.color)
      .toBe('#EF4444');

  });


  test('uses weather fallback when weather API fails', async () => {

    global.fetch
      .mockRejectedValueOnce(
        new Error('Open-Meteo unavailable')
      )

      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          daily: {
            river_discharge: [2],
          },
        }),
      })

      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: {
            items: [
              {
                readings: {
                  pm25_one_hourly: {
                    central: 15,
                  },
                },
              },
            ],
          },
        }),
      });


    await act(async () => {

      TestRenderer.create(
        <AlertContextProvider>
          <TestConsumer />
        </AlertContextProvider>
      );

    });


    expect(contextValue.weatherDetails.currentTemp)
      .toBe(29.5);

    expect(contextValue.weatherDetails.forecast)
      .toHaveLength(3);

  });

});




// import React from 'react';
// import { renderHook, act, waitFor } from '@testing-library/react-native';

// import {
//   AlertContextProvider,
//   useAlerts,
// } from '../../contexts/AlertContext';

// jest.mock('expo-location', () => ({
//   hasServicesEnabledAsync: jest.fn(),
//   requestForegroundPermissionsAsync: jest.fn(),
//   getCurrentPositionAsync: jest.fn(),
//   getLastKnownPositionAsync: jest.fn(),
//   Accuracy: {
//     Balanced: 1,
//   },
// }));

// const Location = require('expo-location');

// describe('AlertContext', () => {

//   beforeEach(() => {
//     jest.clearAllMocks();

//     global.fetch = jest.fn();

//     Location.hasServicesEnabledAsync.mockResolvedValue(true);

//     Location.requestForegroundPermissionsAsync.mockResolvedValue({
//       status: 'granted',
//     });

//     Location.getCurrentPositionAsync.mockResolvedValue({
//       coords: {
//         latitude: 1.3521,
//         longitude: 103.8198,
//       },
//     });
//   });

//   afterEach(() => {
//     jest.restoreAllMocks();
//   });


//   test('provides default environmental data', () => {

//     const wrapper = ({ children }) => (
//       <AlertContextProvider>
//         {children}
//       </AlertContextProvider>
//     );

//     const { result } = renderHook(
//       () => useAlerts(),
//       { wrapper }
//     );

//     expect(result.current).toHaveProperty('loading');
//     expect(result.current).toHaveProperty('pm25Details');
//     expect(result.current).toHaveProperty('weatherDetails');
//     expect(result.current).toHaveProperty('floodDetails');
//     expect(result.current).toHaveProperty('fetchLocalisedTelemetry');
//   });


//   test('retrieves and processes weather, flood and PM2.5 data', async () => {

//     global.fetch
//       // Open-Meteo weather response
//       .mockResolvedValueOnce({
//         ok: true,
//         json: async () => ({
//           current: {
//             temperature_2m: 31,
//           },
//           daily: {
//             time: [
//               '2026-08-19',
//               '2026-08-20',
//               '2026-08-21',
//             ],
//             temperature_2m_max: [33, 32, 34],
//             temperature_2m_min: [27, 26, 27],
//           },
//         }),
//       })

//       // Open-Meteo flood response
//       .mockResolvedValueOnce({
//         ok: true,
//         json: async () => ({
//           daily: {
//             river_discharge: [3.5, 3.2, 3.1],
//           },
//         }),
//       })

//       // NEA response
//       .mockResolvedValueOnce({
//         ok: true,
//         json: async () => ({
//           data: {
//             items: [
//               {
//                 readings: {
//                   pm25_one_hourly: {
//                     central: 42,
//                     east: 40,
//                     west: 38,
//                   },
//                 },
//               },
//             ],
//           },
//         }),
//       });

//     const wrapper = ({ children }) => (
//       <AlertContextProvider>
//         {children}
//       </AlertContextProvider>
//     );

//     const { result } = renderHook(
//       () => useAlerts(),
//       { wrapper }
//     );

//     await waitFor(() => {
//       expect(result.current.loading).toBe(false);
//     });

//     expect(result.current.weatherDetails.currentTemp).toBe(31);

//     expect(result.current.weatherDetails.forecast).toHaveLength(3);

//     expect(result.current.weatherDetails.forecast[0]).toEqual({
//       date: '2026-08-19',
//       max: 33,
//       min: 27,
//     });

//     expect(result.current.floodDetails.riverDischarge).toBe(3.5);

//     expect(result.current.floodDetails.floodRisk)
//       .toBe('Safe (Normal Baseline)');

//     expect(result.current.pm25Details.value).toBe(42);

//     expect(result.current.pm25Details.status)
//       .toBe('Moderate');

//     expect(result.current.pm25Details.color)
//       .toBe('#F59E0B');
//   });


//   test('uses weather fallback when Open-Meteo weather fails', async () => {

//     global.fetch
//       .mockRejectedValueOnce(new Error('Weather API failed'))

//       // Flood still works
//       .mockResolvedValueOnce({
//         ok: true,
//         json: async () => ({
//           daily: {
//             river_discharge: [2.5],
//           },
//         }),
//       })

//       // NEA still works
//       .mockResolvedValueOnce({
//         ok: true,
//         json: async () => ({
//           data: {
//             items: [
//               {
//                 readings: {
//                   pm25_one_hourly: {
//                     central: 20,
//                   },
//                 },
//               },
//             ],
//           },
//         }),
//       });

//     const wrapper = ({ children }) => (
//       <AlertContextProvider>
//         {children}
//       </AlertContextProvider>
//     );

//     const { result } = renderHook(
//       () => useAlerts(),
//       { wrapper }
//     );

//     await waitFor(() => {
//       expect(result.current.loading).toBe(false);
//     });

//     expect(result.current.weatherDetails.currentTemp)
//       .toBe(29.5);

//     expect(result.current.weatherDetails.forecast)
//       .toHaveLength(3);
//   });


//   test('classifies high PM2.5 as hazardous', async () => {

//     global.fetch
//       // Weather
//       .mockResolvedValueOnce({
//         ok: true,
//         json: async () => ({
//           current: {
//             temperature_2m: 30,
//           },
//           daily: {
//             time: ['2026-08-19'],
//             temperature_2m_max: [32],
//             temperature_2m_min: [26],
//           },
//         }),
//       })

//       // Flood
//       .mockResolvedValueOnce({
//         ok: true,
//         json: async () => ({
//           daily: {
//             river_discharge: [2],
//           },
//         }),
//       })

//       // NEA
//       .mockResolvedValueOnce({
//         ok: true,
//         json: async () => ({
//           data: {
//             items: [
//               {
//                 readings: {
//                   pm25_one_hourly: {
//                     central: 60,
//                   },
//                 },
//               },
//             ],
//           },
//         }),
//       });

//     const wrapper = ({ children }) => (
//       <AlertContextProvider>
//         {children}
//       </AlertContextProvider>
//     );

//     const { result } = renderHook(
//       () => useAlerts(),
//       { wrapper }
//     );

//     await waitFor(() => {
//       expect(result.current.loading).toBe(false);
//     });

//     expect(result.current.pm25Details.value).toBe(60);

//     expect(result.current.pm25Details.status)
//       .toBe('Hazardous');

//     expect(result.current.pm25Details.color)
//       .toBe('#EF4444');
//   });

// });