import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { AppText } from '@shared/ui';
import { colors, radius, spacing } from '@shared/lib/theme';

export interface IOption<T extends string> {
  value: T;
  label: string;
}

interface IOptionSelectorProps<T extends string> {
  label?: string;
  options: IOption<T>[];
  value: T | null;
  onChange: (value: T) => void;
  error?: string;
  testID?: string;
}

export function OptionSelector<T extends string>({
  label,
  options,
  value,
  onChange,
  error,
  testID,
}: IOptionSelectorProps<T>) {
  return (
    <View style={styles.wrapper} testID={testID}>
      {label ? (
        <AppText variant="caption" color={colors.textSecondary} style={styles.label}>
          {label}
        </AppText>
      ) : null}
      <View style={styles.optionsRow}>
        {options.map((option) => {
          const selected = option.value === value;
          return (
            <Pressable
              key={option.value}
              testID={`option-${option.value}`}
              onPress={() => onChange(option.value)}
              style={[styles.option, selected && styles.optionSelected]}
            >
              <AppText
                variant="caption"
                color={selected ? colors.white : colors.text}
                style={styles.optionText}
              >
                {option.label}
              </AppText>
            </Pressable>
          );
        })}
      </View>
      {error ? (
        <AppText variant="caption" color={colors.error} style={styles.error}>
          {error}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: spacing.md },
  label: { marginBottom: spacing.xs },
  optionsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
  option: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  optionSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  optionText: { fontWeight: '600' },
  error: { marginTop: spacing.xs },
});