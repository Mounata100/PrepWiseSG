import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import MissionsScreen from '../screens/MissionsScreen';
import GoBagScreen from '../screens/GoBagScreen';
import QuizGameScreen from '../screens/QuizGameScreen';
import ClimateDefence from '../screens/ClimateDefence';

const Stack = createNativeStackNavigator();

export default function MissionsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MissionsHome" component={MissionsScreen} />
      <Stack.Screen name="GoBag" component={GoBagScreen} />
      <Stack.Screen name="QuizGame" component={QuizGameScreen} />
      <Stack.Screen name="ClimateDefence" component={ClimateDefence} />
    </Stack.Navigator>
  );
}