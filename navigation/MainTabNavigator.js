import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';

import HomeScreen from '../screens/HomeScreen';
import MissionsStack from './MissionsStack';
import AlertsScreen from '../screens/AlertsScreen';
import ResourcesScreen from '../screens/ResourcesScreen';
import ProfileStack from './ProfileNavigationStack';

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
  // 1. Fetch real hardware device physical safe boundaries
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        
        // 2. CRITICAL STRUCTURAL FIX HERE
        tabBarStyle: {
          backgroundColor: '#0F172A',
          borderTopWidth: 0,
          
          // Dynamically compute the container footprint height depending on OS parameters
          height: Platform.OS === 'android' ? 65 + insets.bottom : 70,
          
          // Force structural separation padding matching device native bottom key lines
          paddingBottom: Platform.OS === 'android' ? insets.bottom + 10 : 10,
          paddingTop: 10,
          
          position: 'absolute', // Locks layout structure preventing viewport shifts
          bottom: 0,
          left: 0,
          right: 0,
        },

        tabBarActiveTintColor: '#84CC16',
        tabBarInactiveTintColor: '#64748B',

        sceneStyle: {
          // Adjust underlying screen wrapper padding so content doesn't get sliced
          paddingBottom: Platform.OS === 'android' ? 65 + insets.bottom : 70,
          backgroundColor: '#020617',
        },

        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Home') iconName = 'home';
          else if (route.name === 'Missions') iconName = 'game-controller';
          else if (route.name === 'Alerts') iconName = 'warning';
          else if (route.name === 'Resources') iconName = 'book';
          else if (route.name === 'Profile') iconName = 'person';

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Missions" component={MissionsStack} />
      <Tab.Screen name="Alerts" component={AlertsScreen} />
      <Tab.Screen name="Resources" component={ResourcesScreen} />
      <Tab.Screen name="Profile" component={ProfileStack} />
    </Tab.Navigator>
  );
}