import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GreetingFormScreen } from '@features/greeting-form/GreetingFormScreen';
import { GreetingResultScreen } from '@features/greeting-result/GreetingResultScreen';
import type { TRootStackParamList } from './types';

const Stack = createNativeStackNavigator<TRootStackParamList>();

export const RootNavigator: React.FC = () => (
  <Stack.Navigator
    initialRouteName="GreetingForm"
    screenOptions={{ headerShown: false }}
  >
    <Stack.Screen name="GreetingForm" component={GreetingFormScreen} />
    <Stack.Screen name="GreetingResult" component={GreetingResultScreen} />
  </Stack.Navigator>
);