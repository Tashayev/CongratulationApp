// __tests__/integration/GreetingFormScreen.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { GreetingFormScreen } from '@features/greeting-form/GreetingFormScreen';
import { useGreetingFormStore } from '@features/greeting-form/store/useGreetingFormStore';

describe('GreetingFormScreen', () => {
  beforeEach(() => {
    useGreetingFormStore.getState().reset();
  });

  it('updates name field in store when typing', async () => {
    await render(
      <NavigationContainer>
        <GreetingFormScreen />
      </NavigationContainer>,
    );

    fireEvent.changeText(screen.getByTestId('name-input'), 'Anna');

    expect(useGreetingFormStore.getState().data.recipientName).toBe('Anna');
  });

  it('shows validation errors when submitting empty form', async () => {
    await render(
      <NavigationContainer>
        <GreetingFormScreen />
      </NavigationContainer>,
    );

    fireEvent.press(screen.getByTestId('submit-button'));

    await waitFor(() => {
      expect(screen.getByText('errors.nameRequired')).toBeOnTheScreen();
    });
  });
});