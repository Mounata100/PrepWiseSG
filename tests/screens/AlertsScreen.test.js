// // import React from 'react';
// // import renderer, { act } from 'react-test-renderer';

// // import AlertsScreen from '../../screens/AlertsScreen';

// // // Mock the AlertContext
// // const mockFetchTelemetry = jest.fn();

// // jest.mock('../../contexts/AlertContext', () => ({
// //   useAlerts: () => ({
// //     loading: false,

// //     pm25Details: {
// //       value: 42,
// //       status: 'Moderate',
// //       color: '#F59E0B',
// //     },

// //     weatherDetails: {
// //       currentTemp: 31,
// //       forecast: [
// //         {
// //           date: '2026-08-19',
// //           max: 33,
// //           min: 27,
// //         },
// //         {
// //           date: '2026-08-20',
// //           max: 32,
// //           min: 26,
// //         },
// //         {
// //           date: '2026-08-21',
// //           max: 34,
// //           min: 27,
// //         },
// //       ],
// //     },

// //     floodDetails: {
// //       riverDischarge: 5.2,
// //       floodRisk: 'Elevated Flow Level - Monitor Runoffs',
// //       color: '#F59E0B',
// //     },

// //     fetchLocalisedTelemetry: mockFetchTelemetry,
// //   }),
// // }));

// // // Prevent Expo vector icons from loading native modules in Jest
// // jest.mock('@expo/vector-icons', () => ({
// //   Ionicons: () => null,
// // }));

// // describe('AlertsScreen Component', () => {
// //   beforeEach(() => {
// //     jest.clearAllMocks();
// //   });

// //   test('renders the Environmental Monitoring screen', () => {
// //     let component;

// //     act(() => {
// //       component = renderer.create(<AlertsScreen />);
// //     });

// //     const root = component.root;

// //     expect(
// //       root.findByProps({
// //         children: 'Environmental Monitoring',
// //       })
// //     ).toBeTruthy();
// //   });

// //   test('displays weather information by default', () => {
// //     let component;

// //     act(() => {
// //       component = renderer.create(<AlertsScreen />);
// //     });

// //     const root = component.root;

// //     // Current temperature
// //     expect(
// //       root.findByProps({
// //         children: '31°C',
// //       })
// //     ).toBeTruthy();

// //     // Weather section
// //     expect(
// //       root.findByProps({
// //         children: 'Current Temperature',
// //       })
// //     ).toBeTruthy();

// //     // Forecast
// //     expect(
// //       root.findByProps({
// //         children: '2026-08-19',
// //       })
// //     ).toBeTruthy();

// //     expect(
// //       root.findByProps({
// //         children: '33°C / 27°C',
// //       })
// //     ).toBeTruthy();
// //   });

// //   test('switches to PM2.5 tab', () => {
// //     let component;

// //     act(() => {
// //       component = renderer.create(<AlertsScreen />);
// //     });

// //     const root = component.root;

// //     // Find the Text component containing PM2.5
// //     const pm25Text = root.findByProps({
// //       children: 'PM2.5',
// //     });

// //     // Get its parent TouchableOpacity
// //     const pm25Button = pm25Text.parent;

// //     act(() => {
// //       pm25Button.props.onPress();
// //     });

// //     expect(
// //       root.findByProps({
// //         children: 'Localised Air Quality Telemetry',
// //       })
// //     ).toBeTruthy();

// //     expect(
// //       root.findByProps({
// //         children: 42,
// //       })
// //     ).toBeTruthy();

// //     expect(
// //       root.findByProps({
// //         children: 'µg/m³',
// //       })
// //     ).toBeTruthy();

// //     expect(
// //       root.findByProps({
// //         children: 'Air Quality: Moderate',
// //       })
// //     ).toBeTruthy();
// //   });

// //   test('switches to Flood tab', () => {
// //     let component;

// //     act(() => {
// //       component = renderer.create(<AlertsScreen />);
// //     });

// //     const root = component.root;

// //     const floodText = root.findByProps({
// //       children: 'Flood',
// //     });

// //     const floodButton = floodText.parent;

// //     act(() => {
// //       floodButton.props.onPress();
// //     });

// //     expect(
// //       root.findByProps({
// //         children: 'River Discharge Volume Rate',
// //       })
// //     ).toBeTruthy();

// //     expect(
// //       root.findByProps({
// //         children: '5.2 m³/s',
// //       })
// //     ).toBeTruthy();

// //     expect(
// //       root.findByProps({
// //         children: 'Elevated Flow Level - Monitor Runoffs',
// //       })
// //     ).toBeTruthy();
// //   });

// //   test('refresh button calls fetchLocalisedTelemetry', () => {
// //     let component;

// //     act(() => {
// //       component = renderer.create(<AlertsScreen />);
// //     });

// //     const root = component.root;

// //     // Find the refresh TouchableOpacity.
// //     // It is the first TouchableOpacity in the header.
// //     const buttons = root.findAllByType('TouchableOpacity');

// //     expect(buttons.length).toBe(4);

// //     act(() => {
// //       buttons[0].props.onPress();
// //     });

// //     expect(mockFetchTelemetry).toHaveBeenCalledTimes(1);
// //   });
// // });




// // // // // import React from 'react';
// // // // // import { render, fireEvent } from '@testing-library/react-native';

// // // // // import AlertsScreen from '../../screens/AlertsScreen';

// // // // // const mockFetchLocalisedTelemetry = jest.fn();

// // // // // jest.mock('../../contexts/AlertContext', () => ({
// // // // //   useAlerts: () => ({
// // // // //     loading: false,

// // // // //     pm25Details: {
// // // // //       value: 60,
// // // // //       status: 'Hazardous',
// // // // //       color: '#EF4444',
// // // // //     },

// // // // //     weatherDetails: {
// // // // //       currentTemp: 35,
// // // // //       forecast: [
// // // // //         {
// // // // //           date: '2026-08-19',
// // // // //           max: 35,
// // // // //           min: 27,
// // // // //         },
// // // // //         {
// // // // //           date: '2026-08-20',
// // // // //           max: 34,
// // // // //           min: 26,
// // // // //         },
// // // // //         {
// // // // //           date: '2026-08-21',
// // // // //           max: 33,
// // // // //           min: 26,
// // // // //         },
// // // // //       ],
// // // // //     },

// // // // //     floodDetails: {
// // // // //       riverDischarge: 12.5,
// // // // //       floodRisk: 'Critical Flash Flood Threat Vector Active',
// // // // //       color: '#EF4444',
// // // // //     },

// // // // //     fetchLocalisedTelemetry: mockFetchLocalisedTelemetry,
// // // // //   }),
// // // // // }));

// // // // // jest.mock('@expo/vector-icons', () => ({
// // // // //   Ionicons: () => null,
// // // // // }));

// // // // // describe('AlertsScreen Component', () => {

// // // // //   beforeEach(() => {
// // // // //     jest.clearAllMocks();
// // // // //   });


// // // // //   test('renders environmental monitoring heading', () => {

// // // // //     const { getByText } = render(<AlertsScreen />);

// // // // //     expect(
// // // // //       getByText('Environmental Monitoring')
// // // // //     ).toBeTruthy();

// // // // //   });


// // // // //   test('renders weather information by default', () => {

// // // // //     const { getByText } = render(<AlertsScreen />);

// // // // //     expect(
// // // // //       getByText('Current Temperature')
// // // // //     ).toBeTruthy();

// // // // //     expect(
// // // // //       getByText('35°C')
// // // // //     ).toBeTruthy();

// // // // //     expect(
// // // // //       getByText('3-Day Local Projections')
// // // // //     ).toBeTruthy();

// // // // //   });


// // // // //   test('switches from weather to PM2.5 view', () => {

// // // // //     const { getByText } = render(<AlertsScreen />);

// // // // //     fireEvent.press(getByText('PM2.5'));

// // // // //     expect(
// // // // //       getByText('Localised Air Quality Telemetry')
// // // // //     ).toBeTruthy();

// // // // //     expect(
// // // // //       getByText('60')
// // // // //     ).toBeTruthy();

// // // // //     expect(
// // // // //       getByText('Air Quality: Hazardous')
// // // // //     ).toBeTruthy();

// // // // //   });


// // // // //   test('switches to flood view', () => {

// // // // //     const { getByText } = render(<AlertsScreen />);

// // // // //     fireEvent.press(getByText('Flood'));

// // // // //     expect(
// // // // //       getByText('River Discharge Volume Rate')
// // // // //     ).toBeTruthy();

// // // // //     expect(
// // // // //       getByText('12.5 m³/s')
// // // // //     ).toBeTruthy();

// // // // //     expect(
// // // // //       getByText('Critical Flash Flood Threat Vector Active')
// // // // //     ).toBeTruthy();

// // // // //   });


// // // // //   test('refresh button calls telemetry function', () => {

// // // // //     const { UNSAFE_getAllByType } = render(<AlertsScreen />);

// // // // //     const buttons = UNSAFE_getAllByType(
// // // // //       require('react-native').TouchableOpacity
// // // // //     );

// // // // //     // First TouchableOpacity is the refresh button
// // // // //     fireEvent.press(buttons[0]);

// // // // //     expect(mockFetchLocalisedTelemetry).toHaveBeenCalledTimes(1);

// // // // //   });

// // // // // });


// // // // import React from 'react';
// // // // import { render, fireEvent } from '@testing-library/react-native';

// // // // import AlertsScreen from '../../screens/AlertsScreen';

// // // // jest.mock('../../contexts/AlertContext', () => ({
// // // //   useAlerts: jest.fn(),
// // // // }));

// // // // import { useAlerts } from '../../contexts/AlertContext';

// // // // describe('AlertsScreen Component', () => {

// // // //   beforeEach(() => {
// // // //     jest.clearAllMocks();

// // // //     useAlerts.mockReturnValue({
// // // //       loading: false,

// // // //       pm25Details: {
// // // //         value: 42,
// // // //         status: 'Moderate',
// // // //         color: '#F59E0B',
// // // //       },

// // // //       weatherDetails: {
// // // //         currentTemp: 31,
// // // //         forecast: [
// // // //           {
// // // //             date: '2026-08-19',
// // // //             max: 33,
// // // //             min: 26,
// // // //           },
// // // //           {
// // // //             date: '2026-08-20',
// // // //             max: 32,
// // // //             min: 25,
// // // //           },
// // // //           {
// // // //             date: '2026-08-21',
// // // //             max: 34,
// // // //             min: 26,
// // // //           },
// // // //         ],
// // // //       },

// // // //       floodDetails: {
// // // //         riverDischarge: 2.5,
// // // //         floodRisk: 'Safe (Normal Baseline)',
// // // //         color: '#10B981',
// // // //       },

// // // //       fetchLocalisedTelemetry: jest.fn(),
// // // //     });
// // // //   });

// // // //   test('renders the Environmental Monitoring screen', () => {
// // // //     const { getByText } = render(<AlertsScreen />);

// // // //     expect(getByText('Environmental Monitoring')).toBeTruthy();
// // // //     expect(getByText('PM2.5')).toBeTruthy();
// // // //     expect(getByText('Weather')).toBeTruthy();
// // // //     expect(getByText('Flood')).toBeTruthy();
// // // //   });

// // // //   test('displays weather information by default', () => {
// // // //     const { getByText } = render(<AlertsScreen />);

// // // //     expect(getByText('Current Temperature')).toBeTruthy();
// // // //     expect(getByText('31°C')).toBeTruthy();
// // // //     expect(getByText('3-Day Local Projections')).toBeTruthy();

// // // //     expect(getByText('2026-08-19')).toBeTruthy();
// // // //     expect(getByText('33°C / 26°C')).toBeTruthy();
// // // //   });

// // // //   test('switches to PM2.5 tab when pressed', () => {
// // // //     const { getByText } = render(<AlertsScreen />);

// // // //     fireEvent.press(getByText('PM2.5'));

// // // //     expect(
// // // //       getByText('Localised Air Quality Telemetry')
// // // //     ).toBeTruthy();

// // // //     expect(getByText('42')).toBeTruthy();
// // // //     expect(getByText('µg/m³')).toBeTruthy();
// // // //     expect(getByText('Air Quality: Moderate')).toBeTruthy();
// // // //   });

// // // //   test('switches to Flood tab when pressed', () => {
// // // //     const { getByText } = render(<AlertsScreen />);

// // // //     fireEvent.press(getByText('Flood'));

// // // //     expect(
// // // //       getByText('River Discharge Volume Rate')
// // // //     ).toBeTruthy();

// // // //     expect(getByText('2.5 m³/s')).toBeTruthy();
// // // //     expect(
// // // //       getByText('Safe (Normal Baseline)')
// // // //     ).toBeTruthy();
// // // //   });

// // // //   test('calls fetchLocalisedTelemetry when refresh button is pressed', () => {
// // // //     const fetchLocalisedTelemetry = jest.fn();

// // // //     useAlerts.mockReturnValue({
// // // //       loading: false,

// // // //       pm25Details: {
// // // //         value: 42,
// // // //         status: 'Moderate',
// // // //         color: '#F59E0B',
// // // //       },

// // // //       weatherDetails: {
// // // //         currentTemp: 31,
// // // //         forecast: [],
// // // //       },

// // // //       floodDetails: {
// // // //         riverDischarge: 2.5,
// // // //         floodRisk: 'Safe (Normal Baseline)',
// // // //         color: '#10B981',
// // // //       },

// // // //       fetchLocalisedTelemetry,
// // // //     });

// // // //     const { getByRole } = render(<AlertsScreen />);

// // // //     const refreshButton = getByRole('button');

// // // //     fireEvent.press(refreshButton);

// // // //     expect(fetchLocalisedTelemetry).toHaveBeenCalledTimes(1);
// // // //   });

// // // //   test('shows fallback values when PM2.5 data is missing', () => {
// // // //     useAlerts.mockReturnValue({
// // // //       loading: false,

// // // //       pm25Details: null,

// // // //       weatherDetails: {
// // // //         currentTemp: 31,
// // // //         forecast: [],
// // // //       },

// // // //       floodDetails: {
// // // //         riverDischarge: 2.5,
// // // //         floodRisk: 'Safe (Normal Baseline)',
// // // //         color: '#10B981',
// // // //       },

// // // //       fetchLocalisedTelemetry: jest.fn(),
// // // //     });

// // // //     const { getByText } = render(<AlertsScreen />);

// // // //     fireEvent.press(getByText('PM2.5'));

// // // //     expect(getByText('12')).toBeTruthy();
// // // //     expect(getByText('Air Quality: Good')).toBeTruthy();
// // // //   });

// // // // });

// // // import React from 'react';
// // // import TestRenderer, { act } from 'react-test-renderer';

// // // import AlertsScreen from '../../screens/AlertsScreen';

// // // jest.mock('@expo/vector-icons', () => ({
// // //   Ionicons: 'Ionicons',
// // // }));

// // // jest.mock('../../contexts/AlertContext', () => ({
// // //   useAlerts: jest.fn(),
// // // }));

// // // import { useAlerts } from '../../contexts/AlertContext';

// // // describe('AlertsScreen Component', () => {

// // //   const mockFetchTelemetry = jest.fn();

// // //   beforeEach(() => {
// // //     jest.clearAllMocks();

// // //     useAlerts.mockReturnValue({
// // //       loading: false,

// // //       pm25Details: {
// // //         value: 42,
// // //         status: 'Moderate',
// // //         color: '#F59E0B',
// // //       },

// // //       weatherDetails: {
// // //         currentTemp: 31,
// // //         forecast: [
// // //           {
// // //             date: '2026-08-19',
// // //             max: 33,
// // //             min: 26,
// // //           },
// // //           {
// // //             date: '2026-08-20',
// // //             max: 32,
// // //             min: 25,
// // //           },
// // //           {
// // //             date: '2026-08-21',
// // //             max: 34,
// // //             min: 26,
// // //           },
// // //         ],
// // //       },

// // //       floodDetails: {
// // //         riverDischarge: 2.5,
// // //         floodRisk: 'Safe (Normal Baseline)',
// // //         color: '#10B981',
// // //       },

// // //       fetchLocalisedTelemetry: mockFetchTelemetry,
// // //     });
// // //   });

// // //   test('renders the Environmental Monitoring screen', () => {
// // //     let renderer;

// // //     act(() => {
// // //       renderer = TestRenderer.create(<AlertsScreen />);
// // //     });

// // //     const root = renderer.root;

// // //     expect(
// // //       root.findByProps({ children: 'Environmental Monitoring' })
// // //     ).toBeTruthy();

// // //     expect(
// // //       root.findByProps({ children: 'Weather' })
// // //     ).toBeTruthy();

// // //     expect(
// // //       root.findByProps({ children: 'PM2.5' })
// // //     ).toBeTruthy();

// // //     expect(
// // //       root.findByProps({ children: 'Flood' })
// // //     ).toBeTruthy();
// // //   });

// // //   test('displays weather information by default', () => {
// // //     let renderer;

// // //     act(() => {
// // //       renderer = TestRenderer.create(<AlertsScreen />);
// // //     });

// // //     const root = renderer.root;

// // //     expect(
// // //       root.findByProps({ children: 'Current Temperature' })
// // //     ).toBeTruthy();

// // //     expect(
// // //       root.findByProps({ children: '31°C' })
// // //     ).toBeTruthy();

// // //     expect(
// // //       root.findByProps({ children: '3-Day Local Projections' })
// // //     ).toBeTruthy();
// // //   });

// // //   test('switches to PM2.5 tab', () => {
// // //     let renderer;

// // //     act(() => {
// // //       renderer = TestRenderer.create(<AlertsScreen />);
// // //     });

// // //     const root = renderer.root;

// // //     const pm25Button = root.findByProps({
// // //       children: expect.any(Object),
// // //     });

// // //     const buttons = root.findAllByType('TouchableOpacity');

// // //     // PM2.5 is the first tab
// // //     act(() => {
// // //       buttons[1].props.onPress();
// // //     });

// // //     expect(
// // //       root.findByProps({
// // //         children: 'Localised Air Quality Telemetry',
// // //       })
// // //     ).toBeTruthy();

// // //     expect(
// // //       root.findByProps({ children: '42' })
// // //     ).toBeTruthy();

// // //     expect(
// // //       root.findByProps({
// // //         children: 'Air Quality: Moderate',
// // //       })
// // //     ).toBeTruthy();
// // //   });

// // //   test('switches to Flood tab', () => {
// // //     let renderer;

// // //     act(() => {
// // //       renderer = TestRenderer.create(<AlertsScreen />);
// // //     });

// // //     const root = renderer.root;

// // //     const buttons = root.findAllByType('TouchableOpacity');

// // //     // Flood is the third tab
// // //     act(() => {
// // //       buttons[3].props.onPress();
// // //     });

// // //     expect(
// // //       root.findByProps({
// // //         children: 'River Discharge Volume Rate',
// // //       })
// // //     ).toBeTruthy();

// // //     expect(
// // //       root.findByProps({
// // //         children: '2.5 m³/s',
// // //       })
// // //     ).toBeTruthy();

// // //     expect(
// // //       root.findByProps({
// // //         children: 'Safe (Normal Baseline)',
// // //       })
// // //     ).toBeTruthy();
// // //   });

// // //   test('refresh button calls fetchLocalisedTelemetry', () => {
// // //     let renderer;

// // //     act(() => {
// // //       renderer = TestRenderer.create(<AlertsScreen />);
// // //     });

// // //     const root = renderer.root;

// // //     const buttons = root.findAllByType('TouchableOpacity');

// // //     // First button is refresh, next three are tabs
// // //     act(() => {
// // //       buttons[0].props.onPress();
// // //     });

// // //     expect(mockFetchTelemetry).toHaveBeenCalledTimes(1);
// // //   });
// // // });


// import React from 'react';
// import renderer, { act } from 'react-test-renderer';

// import AlertsScreen from '../../screens/AlertsScreen';

// const mockFetchTelemetry = jest.fn();

// jest.mock('../../contexts/AlertContext', () => ({
//   useAlerts: () => ({
//     loading: false,

//     pm25Details: {
//       value: 42,
//       status: 'Moderate',
//       color: '#F59E0B',
//     },

//     weatherDetails: {
//       currentTemp: 31,
//       forecast: [
//         {
//           date: '2026-08-19',
//           max: 33,
//           min: 27,
//         },
//         {
//           date: '2026-08-20',
//           max: 32,
//           min: 26,
//         },
//         {
//           date: '2026-08-21',
//           max: 34,
//           min: 27,
//         },
//       ],
//     },

//     floodDetails: {
//       riverDischarge: 5.2,
//       floodRisk: 'Elevated Flow Level - Monitor Runoffs',
//       color: '#F59E0B',
//     },

//     fetchLocalisedTelemetry: mockFetchTelemetry,
//   }),
// }));

// // Prevent Expo native icon modules from loading in Jest
// jest.mock('@expo/vector-icons', () => ({
//   Ionicons: () => null,
// }));


// /*
//  * Helper:
//  * React Test Renderer can represent:
//  *
//  * {31}°C
//  *
//  * as multiple children rather than one "31°C" string.
//  *
//  * This helper searches all Text nodes and combines their children.
//  */
// function findText(root, expectedText) {
//   const textNodes = root.findAll(
//     node => node.type === 'Text'
//   );

//   const match = textNodes.find(node => {
//     const children = node.props.children;

//     if (Array.isArray(children)) {
//       return children.join('') === expectedText;
//     }

//     return String(children) === expectedText;
//   });

//   if (!match) {
//     throw new Error(`Could not find text: ${expectedText}`);
//   }

//   return match;
// }

// /*
//  * Helper:
//  * Find an element that has an onPress function.
//  *
//  * We don't depend on TouchableOpacity's internal
//  * React Native rendering.
//  */
// function findPressableForText(root, text) {
//   const textNode = findText(root, text);

//   let current = textNode;

//   while (current) {
//     if (
//       current.props &&
//       typeof current.props.onPress === 'function'
//     ) {
//       return current;
//     }

//     current = current.parent;
//   }

//   throw new Error(`Could not find pressable for text: ${text}`);
// }

// function findPressableElements(root) {
//   return root.findAll(
//     node =>
//       node.props &&
//       typeof node.props.onPress === 'function'
//   );
// }


// describe('AlertsScreen Component', () => {

//   beforeEach(() => {
//     jest.clearAllMocks();
//   });


//   test('renders the Environmental Monitoring screen', () => {
//     let component;

//     act(() => {
//       component = renderer.create(<AlertsScreen />);
//     });

//     const root = component.root;

//     expect(
//       findText(root, 'Environmental Monitoring')
//     ).toBeTruthy();
//   });


//   test('displays weather information by default', () => {
//     let component;

//     act(() => {
//       component = renderer.create(<AlertsScreen />);
//     });

//     const root = component.root;

//     // Current temperature
//     expect(
//       findText(root, '31°C')
//     ).toBeTruthy();

//     // Weather heading
//     expect(
//       findText(root, 'Current Temperature')
//     ).toBeTruthy();

//     // Forecast date
//     expect(
//       findText(root, '2026-08-19')
//     ).toBeTruthy();

//     // Forecast temperature
//     expect(
//       findText(root, '33°C / 27°C')
//     ).toBeTruthy();
//   });


//   test('switches to PM2.5 tab', () => {
//     let component;

//     act(() => {
//       component = renderer.create(<AlertsScreen />);
//     });

//     const root = component.root;

//     const pressables = findPressableElements(root);

//     /*
//      * The order in AlertsScreen is:
//      *
//      * 0 = refresh
//      * 1 = PM2.5
//      * 2 = Weather
//      * 3 = Flood
//      */

//     expect(pressables.length).toBeGreaterThanOrEqual(4);

//     act(() => {
//       pressables[1].props.onPress();
//     });

//     expect(
//       findText(root, 'Localised Air Quality Telemetry')
//     ).toBeTruthy();

//     expect(
//       findText(root, '42')
//     ).toBeTruthy();

//     expect(
//       findText(root, 'µg/m³')
//     ).toBeTruthy();

//     expect(
//       findText(root, 'Air Quality: Moderate')
//     ).toBeTruthy();
//   });


//   test('switches to Flood tab', () => {
//     let component;

//     act(() => {
//       component = renderer.create(<AlertsScreen />);
//     });

//     const root = component.root;

//     const pressables = findPressableElements(root);

//     expect(pressables.length).toBeGreaterThanOrEqual(4);

//     act(() => {
//       pressables[3].props.onPress();
//     });

//     expect(
//       findText(root, 'River Discharge Volume Rate')
//     ).toBeTruthy();

//     expect(
//       findText(root, '5.2 m³/s')
//     ).toBeTruthy();

//     expect(
//       findText(root, 'Elevated Flow Level - Monitor Runoffs')
//     ).toBeTruthy();
//   });


//   test('refresh button calls fetchLocalisedTelemetry', () => {
//     let component;

//     act(() => {
//       component = renderer.create(<AlertsScreen />);
//     });

//     const root = component.root;

//     const pressables = findPressableElements(root);

//     expect(pressables.length).toBeGreaterThanOrEqual(4);

//     // First pressable is the refresh button
//     act(() => {
//       pressables[0].props.onPress();
//     });

//     expect(mockFetchTelemetry).toHaveBeenCalledTimes(1);
//   });

// });




import React from 'react';
import renderer, { act } from 'react-test-renderer';

import AlertsScreen from '../../screens/AlertsScreen';


// =====================================================
// MOCK ALERT CONTEXT
// =====================================================

const mockFetchTelemetry = jest.fn();

jest.mock('../../contexts/AlertContext', () => ({
  useAlerts: () => ({
    loading: false,

    pm25Details: {
      value: 42,
      status: 'Moderate',
      color: '#F59E0B',
    },

    weatherDetails: {
      currentTemp: 31,
      forecast: [
        {
          date: '2026-08-19',
          max: 33,
          min: 27,
        },
        {
          date: '2026-08-20',
          max: 32,
          min: 26,
        },
        {
          date: '2026-08-21',
          max: 34,
          min: 27,
        },
      ],
    },

    floodDetails: {
      riverDischarge: 5.2,
      floodRisk: 'Elevated Flow Level - Monitor Runoffs',
      color: '#F59E0B',
    },

    fetchLocalisedTelemetry: mockFetchTelemetry,
  }),
}));


// =====================================================
// MOCK EXPO ICONS
// Prevents native Expo modules from causing Jest errors
// =====================================================

jest.mock('@expo/vector-icons', () => ({
  Ionicons: () => null,
}));


// =====================================================
// HELPER 1
// Find Text regardless of whether React renders the
// content as one child or multiple children.
// =====================================================

function findText(root, expectedText) {
  const textNodes = root.findAll(
    node => node.type === 'Text'
  );

  const match = textNodes.find(node => {
    const children = node.props.children;

    if (Array.isArray(children)) {
      return children.join('') === expectedText;
    }

    return String(children) === expectedText;
  });

  if (!match) {
    throw new Error(`Could not find text: ${expectedText}`);
  }

  return match;
}


// =====================================================
// HELPER 2
// Find the TouchableOpacity/onPress associated with
// a particular Text label such as PM2.5 or Flood.
// =====================================================

function findPressableForText(root, text) {
  const textNode = findText(root, text);

  let current = textNode;

  while (current) {
    if (
      current.props &&
      typeof current.props.onPress === 'function'
    ) {
      return current;
    }

    current = current.parent;
  }

  throw new Error(`Could not find pressable for text: ${text}`);
}


// =====================================================
// TEST SUITE
// =====================================================

describe('AlertsScreen Component', () => {

  // Reset mock function before every test
  beforeEach(() => {
    jest.clearAllMocks();
  });


  // ===================================================
  // TEST 1
  // Component renders correctly
  // ===================================================

  test('renders the Environmental Monitoring screen', () => {
    let component;

    act(() => {
      component = renderer.create(<AlertsScreen />);
    });

    const root = component.root;

    expect(
      findText(root, 'Environmental Monitoring')
    ).toBeTruthy();
  });


  // ===================================================
  // TEST 2
  // Weather tab is selected by default
  // ===================================================

  test('displays weather information by default', () => {
    let component;

    act(() => {
      component = renderer.create(<AlertsScreen />);
    });

    const root = component.root;

    // Current temperature
    expect(
      findText(root, '31°C')
    ).toBeTruthy();

    // Weather section title
    expect(
      findText(root, 'Current Temperature')
    ).toBeTruthy();

    // Forecast date
    expect(
      findText(root, '2026-08-19')
    ).toBeTruthy();

    // Forecast temperature
    expect(
      findText(root, '33°C / 27°C')
    ).toBeTruthy();

    // Second forecast day
    expect(
      findText(root, '2026-08-20')
    ).toBeTruthy();

    // Third forecast day
    expect(
      findText(root, '2026-08-21')
    ).toBeTruthy();
  });


  // ===================================================
  // TEST 3
  // PM2.5 tab interaction
  // ===================================================

  test('switches to PM2.5 tab', () => {
    let component;

    act(() => {
      component = renderer.create(<AlertsScreen />);
    });

    const root = component.root;

    // Find the PM2.5 tab using its actual text
    const pm25Button = findPressableForText(
      root,
      'PM2.5'
    );

    // Simulate user pressing PM2.5
    act(() => {
      pm25Button.props.onPress();
    });

    // PM2.5 screen should now be displayed
    expect(
      findText(
        root,
        'Localised Air Quality Telemetry'
      )
    ).toBeTruthy();

    // PM2.5 value
    expect(
      findText(root, '42')
    ).toBeTruthy();

    // Unit
    expect(
      findText(root, 'µg/m³')
    ).toBeTruthy();

    // Status
    expect(
      findText(root, 'Air Quality: Moderate')
    ).toBeTruthy();
  });


  // ===================================================
  // TEST 4
  // Flood tab interaction
  // ===================================================

  test('switches to Flood tab', () => {
    let component;

    act(() => {
      component = renderer.create(<AlertsScreen />);
    });

    const root = component.root;

    // Find Flood tab using its actual text
    const floodButton = findPressableForText(
      root,
      'Flood'
    );

    // Simulate user pressing Flood
    act(() => {
      floodButton.props.onPress();
    });

    // Flood screen should now be displayed
    expect(
      findText(
        root,
        'River Discharge Volume Rate'
      )
    ).toBeTruthy();

    // River discharge
    expect(
      findText(root, '5.2 m³/s')
    ).toBeTruthy();

    // Flood risk status
    expect(
      findText(
        root,
        'Elevated Flow Level - Monitor Runoffs'
      )
    ).toBeTruthy();
  });


  // ===================================================
  // TEST 5
  // Refresh button calls context function
  // ===================================================

  test('refresh button calls fetchLocalisedTelemetry', () => {
    let component;

    act(() => {
      component = renderer.create(<AlertsScreen />);
    });

    const root = component.root;

    // Find all elements that have an onPress function
    const pressables = root.findAll(
      node =>
        node.props &&
        typeof node.props.onPress === 'function'
    );

    // AlertsScreen should have:
    //
    // 1. Refresh
    // 2. PM2.5
    // 3. Weather
    // 4. Flood

    expect(pressables.length).toBeGreaterThanOrEqual(4);

    // First pressable is the refresh button
    act(() => {
      pressables[0].props.onPress();
    });

    expect(
      mockFetchTelemetry
    ).toHaveBeenCalledTimes(1);
  });

});