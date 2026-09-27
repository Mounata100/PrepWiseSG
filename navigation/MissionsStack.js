import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import MissionsScreen from '../screens/MissionsScreen';
import GoBagScreen from '../screens/GoBagScreen';
import ClimateDefence from '../screens/ClimateDefence';
import FloodRunnerGameModal from '../screens/FloodRunnerGameModal';
import VoucherStoreScreen from '../screens/VoucherStoreScreen';

const Stack = createNativeStackNavigator();

export default function MissionsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MissionsHome" component={MissionsScreen} />
      <Stack.Screen name="GoBag" component={GoBagScreen} />
      <Stack.Screen name="ClimateDefence" component={ClimateDefence} />
      <Stack.Screen name="FloodRunnerGameModal" component={FloodRunnerGameModal}/>
      <Stack.Screen name="VoucherStore" component={VoucherStoreScreen} />
    </Stack.Navigator>
  );
}