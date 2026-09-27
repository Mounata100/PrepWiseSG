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

// navigation/AppNavigator.js

import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useUser } from '../contexts/UserContext';

import AuthScreen from '../screens/AuthScreen';
import ClimateDefence from '../screens/ClimateDefence';
import OnboardingScreen from '../screens/OnBoardingScreen';
import MainTabNavigator from '../navigation/MainTabNavigator';
import LeaderBoardScreen from '../screens/LeaderBoardScreen';
import HealthQRScreen from '../screens/HealthQRScreen';
import FamilySafetyScreen from '../screens/SafeFamilyScreen';
import ChecklistScreen from '../screens/ChecklistScreen';
import GoBagScreen from '../screens/GoBagScreen';
import ResourcesScreen from '../screens/ResourcesScreen';
import VoucherStoreScreen from '../screens/VoucherStoreScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {

  // ---------------------------------------------------------
  // USER CONTEXT
  // ---------------------------------------------------------
  // isAuthenticated = true for a registered Firebase user.
  //
  // isGuest = true when the user chooses "Continue as Guest".
  //
  // A guest is intentionally NOT Firebase authenticated,
  // but they should still be allowed to enter the application.
  // ---------------------------------------------------------
  const {
    isAuthenticated,
    isGuest,
    isLoading,
    user,
  } = useUser();


  // ---------------------------------------------------------
  // INITIAL LOADING
  // ---------------------------------------------------------
  // UserContext checks AsyncStorage/Firebase before deciding
  // what screen should be displayed.
  //
  // While this is happening, don't show AuthScreen because
  // doing so can cause an unwanted login-screen flash.
  // ---------------------------------------------------------
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator
          size="large"
          color="#0F766E"
        />
      </View>
    );
  }


  // ---------------------------------------------------------
  // AUTHENTICATION CHECK
  // ---------------------------------------------------------
  //
  // Registered user:
  //     isAuthenticated = true
  //     isGuest = false
  //
  // Guest:
  //     isAuthenticated = false
  //     isGuest = true
  //
  // Therefore:
  //
  //     !isAuthenticated && !isGuest
  //
  // means the user is genuinely not logged in and has NOT
  // chosen guest mode.
  // ---------------------------------------------------------

  const canEnterApp = isAuthenticated || isGuest;


  return (
    <NavigationContainer>

      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >

        {!canEnterApp ? (

          // ---------------------------------------------------
          // NOT AUTHENTICATED
          // ---------------------------------------------------
          // The user hasn't signed in and hasn't selected
          // guest mode, so show the authentication screen.
          // ---------------------------------------------------

          <Stack.Screen
            name="Auth"
            component={AuthScreen}
          />

        ) : (

          // ---------------------------------------------------
          // USER CAN ENTER THE APP
          // ---------------------------------------------------
          //
          // This section is now used for BOTH:
          //
          // 1. Registered users
          // 2. Guest users
          //
          // ---------------------------------------------------

          <>

            {/* 
              Registered users who have completed onboarding,
              and guests, go directly to Main.

              A new registered user who hasn't completed
              onboarding goes to the onboarding screen.
            */}

            {isGuest || user?.onboardingCompleted ? (

              <Stack.Screen
                name="Main"
                component={MainTabNavigator}
              />

            ) : (

              <Stack.Screen
                name="Onboarding"
                component={OnboardingScreen}
              />

            )}


            {/* ------------------------------------------------
                APPLICATION SCREENS
               ------------------------------------------------ */}

            <Stack.Screen
              name="Leaderboard"
              component={LeaderBoardScreen}
            />

            <Stack.Screen
              name="Resources"
              component={ResourcesScreen}
            />

            <Stack.Screen
              name="HealthQR"
              component={HealthQRScreen}
            />

            <Stack.Screen
              name="FamilySafety"
              component={FamilySafetyScreen}
            />

            <Stack.Screen
              name="Checklist"
              component={ChecklistScreen}
            />

            <Stack.Screen
              name="GoBag"
              component={GoBagScreen}
            />

            <Stack.Screen
              name="VoucherStore"
              component={VoucherStoreScreen}
            />

            <Stack.Screen
              name="ClimateDefence"
              component={ClimateDefence}
            />

          </>

        )}

      </Stack.Navigator>

    </NavigationContainer>
  );
}


const styles = StyleSheet.create({

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#020617',
  },

});
