import React from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  type TextInputProps,
} from 'react-native';
import { AppText } from './AppText';
import { colors, radius, spacing } from '../lib/theme';

interface IInputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export const Input: React.FC<IInputProps> = ({ label, error, style, ...rest }) => (
  <View style={styles.wrapper}>
    {label ? (
      <AppText variant="caption" color={colors.textSecondary} style={styles.label}>
        {label}
      </AppText>
    ) : null}
    <TextInput
      testID="app-input"
      placeholderTextColor={colors.textSecondary}
      style={[styles.input, !!error && styles.inputError, style]}
      {...rest}
    />
    {error ? (
      <AppText variant="caption" color={colors.error} style={styles.error}>
        {error}
      </AppText>
    ) : null}
  </View>
);

const styles = StyleSheet.create({
  wrapper: { marginBottom: spacing.md },
  label: { marginBottom: spacing.xs },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.surface,
  },
  inputError: { borderColor: colors.error },
  error: { marginTop: spacing.xs },
});