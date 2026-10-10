import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GreetingFormScreen } from '@features/greeting-form/GreetingFormScreen';
import { useGreetingFormStore } from '@features/greeting-form/store/useGreetingFormStore';

const initialMetrics = {
  frame: { x: 0, y: 0, width: 390, height: 844 },
  insets: { top: 44, left: 0, right: 0, bottom: 34 },
};

const renderScreen = () =>
  render(
    <SafeAreaProvider initialMetrics={initialMetrics}>
      <NavigationContainer>
        <GreetingFormScreen />
      </NavigationContainer>
    </SafeAreaProvider>,
  );

describe('GreetingFormScreen', () => {
  beforeEach(() => {
    useGreetingFormStore.getState().reset();
  });

  it('updates name field in store when typing', async () => {
    await renderScreen();

    fireEvent.changeText(screen.getByTestId('name-input'), 'Anna');

    expect(useGreetingFormStore.getState().data.recipientName).toBe('Anna');
  });

  it('shows validation errors when submitting empty form', async () => {
    await renderScreen();

    fireEvent.press(screen.getByTestId('submit-button'));

    await waitFor(() => {
      expect(screen.getByText('Please enter a name')).toBeOnTheScreen();
      expect(screen.getByText('Please select an event')).toBeOnTheScreen();
    });
  });
});