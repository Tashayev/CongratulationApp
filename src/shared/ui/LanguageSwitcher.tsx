import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { AppText } from './AppText';
import { colors, radius, spacing } from '../lib/theme';
import { LANGUAGES, LANGUAGE_LABELS, type TLanguage } from '@i18n/const';

export const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();
  const current = i18n.language as TLanguage;

  const handleChange = (lang: TLanguage) => {
    if (lang !== current) i18n.changeLanguage(lang);
  };

  return (
    <View style={styles.row} testID="language-switcher">
      {LANGUAGES.map((lang) => {
        const active = lang === current;
        return (
          <Pressable
            key={lang}
            onPress={() => handleChange(lang)}
            testID={`lang-${lang}`}
            style={[styles.chip, active && styles.chipActive]}
          >
            <AppText
              variant="caption"
              color={active ? colors.white : colors.text}
              style={styles.label}
            >
              {LANGUAGE_LABELS[lang]}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  label: { fontWeight: '600' },
});