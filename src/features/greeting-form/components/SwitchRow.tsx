import React from 'react';
import { StyleSheet, Switch, View } from 'react-native';
import { AppText } from '@shared/ui';
import { colors, spacing } from '@shared/lib/theme';

interface ISwitchRowProps {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
  testID?: string;
}

export const SwitchRow: React.FC<ISwitchRowProps> = ({
  label,
  value,
  onChange,
  testID,
}) => (
  <View style={styles.row} testID={testID}>
    <AppText variant="body">{label}</AppText>
    <Switch
      value={value}
      onValueChange={onChange}
      trackColor={{ false: colors.border, true: colors.primary }}
      thumbColor={colors.white}
    />
  </View>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
  },
});