// import React from 'react';
// import { View, ActivityIndicator, StyleSheet } from 'react-native';
// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { SafeAreaProvider } from 'react-native-safe-area-context';

// import { useUser } from '../contexts/UserContext';
// import { GameProvider } from '../contexts/GameContext'; // Added here to make games universally accessible

// import AuthScreen from '../screens/AuthScreen';
// import AlertsScreen from '../screens/AlertsScreen';
// import HomeScreen from '../screens/HomeScreen';
// import ClimateDefence from '../screens/ClimateDefence';
// import OnboardingScreen from '../screens/OnBoardingScreen';
// import MainTabNavigator from '../navigation/MainTabNavigator'; // Import clean external layout
// import LeaderBoardScreen from '../screens/LeaderBoardScreen';
// import HealthQRScreen from "../screens/HealthQRScreen";
// import FamilySafetyScreen from "../screens/SafeFamilyScreen";
// import QuizGameScreen from "../screens/QuizGameScreen";
// import GoBagScreen from "../screens/GoBagScreen";
// import VoucherStoreScreen from "../screens/VoucherStoreScreen";

// const Stack = createNativeStackNavigator();

// export default function AppNavigator() {
//   const { isAuthenticated, isLoading, user } = useUser();

//   if (isLoading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#0F766E" />
//       </View>
//     );
//   }

//   return (
//     <SafeAreaProvider>
//       <GameProvider>
//         <NavigationContainer>
//           <Stack.Navigator screenOptions={{ headerShown: false }}>
//             {isAuthenticated ? (
//               <>
//                 {user?.onboardingCompleted ? (
//                   <Stack.Screen name="Main" component={MainTabNavigator} />
//                 ) : (
//                   <Stack.Screen name="Onboarding" component={OnboardingScreen} />
//                 )}
//                 <Stack.Screen name="Leaderboard" component={LeaderBoardScreen} />
//                 <Stack.Screen name="HealthQR" component={HealthQRScreen} />
//                 <Stack.Screen name="FamilySafety" component={FamilySafetyScreen} />
//                 <Stack.Screen name="QuizGame" component={QuizGameScreen} />
//                 <Stack.Screen name="GoBag" component={GoBagScreen} />
//                 <Stack.Screen name="VoucherStore" component={VoucherStoreScreen} />
//                 <Stack.Screen name="ClimateDefence" component={ClimateDefence} />
//               </>
//             ) : (
//               <Stack.Screen name="Auth" component={AuthScreen} />
              
//             )}
//           </Stack.Navigator>
//         </NavigationContainer>
//       </GameProvider>
//     </SafeAreaProvider>
//   );
// }

// const styles = StyleSheet.create({
//   loadingContainer: { 
//     flex: 1, 
//     justifyContent: 'center', 
//     alignItems: 'center', 
//     backgroundColor: '#020617' 
//   },
// });





import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { useUser } from '../contexts/UserContext';
import { GameProvider } from '../contexts/GameContext'; // Added here to make games universally accessible

import AuthScreen from '../screens/AuthScreen';
import AlertsScreen from '../screens/AlertsScreen';
import HomeScreen from '../screens/HomeScreen';
import ClimateDefence from '../screens/ClimateDefence';
import OnboardingScreen from '../screens/OnBoardingScreen';
import MainTabNavigator from '../navigation/MainTabNavigator'; // Import clean external layout
import LeaderBoardScreen from '../screens/LeaderBoardScreen';
import HealthQRScreen from "../screens/HealthQRScreen";
import FamilySafetyScreen from "../screens/SafeFamilyScreen";
import QuizGameScreen from "../screens/QuizGameScreen";
import GoBagScreen from "../screens/GoBagScreen";
import VoucherStoreScreen from "../screens/VoucherStoreScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { isAuthenticated, isLoading, user } = useUser();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0F766E" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <GameProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            {isAuthenticated ? (
              <>
                {user?.onboardingCompleted ? (
                  <Stack.Screen name="Main" component={MainTabNavigator} />
                ) : (
                  <Stack.Screen name="Onboarding" component={OnboardingScreen} />
                )}
                <Stack.Screen name="Leaderboard" component={LeaderBoardScreen} />
                <Stack.Screen name="HealthQR" component={HealthQRScreen} />
                <Stack.Screen name="FamilySafety" component={FamilySafetyScreen} />
                <Stack.Screen name="QuizGame" component={QuizGameScreen} />
                <Stack.Screen name="GoBag" component={GoBagScreen} />
                <Stack.Screen name="VoucherStore" component={VoucherStoreScreen} />
                <Stack.Screen name="ClimateDefence" component={ClimateDefence} />
              </>
            ) : (
              <Stack.Screen name="Auth" component={AuthScreen} />
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </GameProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#020617' 
  },
});