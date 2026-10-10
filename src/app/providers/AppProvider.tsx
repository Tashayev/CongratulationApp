import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar, useColorScheme } from 'react-native';
import '@i18n/i18n'; // Инициализация i18n

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isDark = useColorScheme() === 'dark';
  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <NavigationContainer>{children}</NavigationContainer>
    </SafeAreaProvider>
  );
};