/** 
 * ====================================================================================
 * COMPONENT: HomeScreen
 * ROLE: Core Operator Command Dashboard & Gamified Readiness Portal
 * ====================================================================================
 * * SUMMARY:
 * Serves as the primary landing hub for users, aggregating real-time climate 
 * telemetry alongside local personal engagement loops. Designed with a high-contrast,
 * dark-mode aesthetic to reduce eye strain, it visually categorizes information 
 * into clear operational hierarchies using scannable data layouts.
 * * ARCHITECTURE & DATA PIPELINES:
 * 1. User Metrics Stack (UserContext):
 * Tracks the current profile level and dynamically computes/displays the active
 * Operational Streak Flame. It prevents excessive layouts by merging the daily 
 * streak indicator directly into the Top Command Panel.
 * * 2. Incident Monitoring Broadcasts (AlertContext):
 * Pulls live data from the combined NEA & Open-Meteo context feeds. It dynamically 
 * calculates total incident quantities and alters its visual hierarchy—switching 
 * to a high-visibility crimson state (#EF4444) if high-severity hazard indicators 
 * are triggered in the area.
 * * 3. Secured Honors Ribbon:
 * Renders a horizontally scrollable container tracking user achievement tokens 
 * (`go_bag_master`, `quiz_master`, etc.). Maps keys against an internal data structure 
 * to display clean status tags with custom borders without cluttering the screen.
 * * 4. Regional Leaderboard Sync (AsyncStorage):
 * Combines hardcoded local entries with the active operator's profile data. It sorts 
 * and maps the top 4 entries, dynamically highlighting the active user's row with a 
 * subtle green tint to establish instant local standing.
 * * 5. Interactive Tactical Readiness Card:
 * A progressive checklist engine managing local task execution states (`locked`, 
 * `operational`, `verified`). It rewards action completion by unlocking proof-of-work 
 * logging buttons once all verification conditions pass.
 * * LIFECYCLE & PERFORMANCE:
 * Uses React state array hooks and standard layout definitions to protect frames per 
 * second. Offloads complex computational sorting routines into optimized native view rendering 
 * and handles scrolling boundaries safely via standard ScrollViews with persistent bottom buffers.
 * ====================================================================================
 */
// App.js
import React from 'react';
import { StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { UserProvider } from './contexts/UserContext';
import { GameProvider } from './contexts/GameContext';
import { AlertContextProvider } from './contexts/AlertContext';
import AppNavigator from './navigation/AppNavigator';
import * as Notifications from "expo-notifications";

// --------------------------------------------------
// Notification handler
// --------------------------------------------------
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});
const ROOT_STYLE = { flex: 1 };

// --------------------------------------------------
// App content
// --------------------------------------------------

function AppContent() {
  const { theme } = useUser();

  const isDark = theme === 'dark';

  return (
    <>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={isDark ? '#020617' : '#F8FAFC'}
      />

      <AppNavigator />
    </>
  );
}

// --------------------------------------------------
// Root App
// --------------------------------------------------
export default function App() {
  return (
    <GestureHandlerRootView style={ROOT_STYLE}>
      <SafeAreaProvider>
        <UserProvider>
          <GameProvider>
            <AlertContextProvider>
              <StatusBar barStyle="light-content" backgroundColor="#020617"/>
              <AppNavigator />
            </AlertContextProvider>
          </GameProvider>
        </UserProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}