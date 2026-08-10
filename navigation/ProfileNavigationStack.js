import React from 'react';

import {
  createNativeStackNavigator,
} from '@react-navigation/native-stack';

import ProfileScreen
  from '../screens/ProfileScreen';

import LeaderBoardScreen
  from '../screens/LeaderBoardScreen';

import SettingsScreen
  from '../screens/SettingsScreen';

const Stack =
  createNativeStackNavigator();

export default function ProfileStack() {

  return (

    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >

      <Stack.Screen
        name="ProfileMain"
        component={ProfileScreen}
      />

      <Stack.Screen
        name="Leaderboard"
        component={LeaderBoardScreen}
      />

      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
      />

    </Stack.Navigator>
  );
}