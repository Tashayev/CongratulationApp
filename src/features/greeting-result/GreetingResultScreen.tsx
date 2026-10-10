import React, { useEffect } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRoute, type RouteProp } from '@react-navigation/native';
import Clipboard from '@react-native-clipboard/clipboard';
import { Screen, AppText, Button } from '@shared/ui';
import { colors, radius, spacing } from '@shared/lib/theme';
import type { TRootStackParamList } from '@app/navigation/types';
import { useGenerateGreeting } from './hooks/useGenerateGreeting';

type TResultRoute = RouteProp<TRootStackParamList, 'GreetingResult'>;

export const GreetingResultScreen: React.FC = () => {
  const { t } = useTranslation();
  const route = useRoute<TResultRoute>();
  const { formData } = route.params;
  const { text, isStreaming, error, generate, cancel, reset } =
    useGenerateGreeting();

  useEffect(() => {
    generate(formData);
    return () => cancel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCopy = () => {
    if (text) Clipboard.setString(text);
  };

  const handleRegenerate = () => {
    reset();
    generate(formData);
  };

  return (
    <Screen scrollable>
      <AppText variant="h1" style={styles.title}>
        {t('result.title')}
      </AppText>

      {error ? (
        <View style={styles.errorBox}>
          <AppText color={colors.error} variant="body">
            {error}
          </AppText>
          <Button
            title={t('common.retry')}
            variant="secondary"
            onPress={handleRegenerate}
            style={styles.retryButton}
          />
        </View>
      ) : null}

      <View style={styles.card}>
        {text ? (
          <AppText variant="body" style={styles.text}>
            {text}
          </AppText>
        ) : isStreaming ? (
          <View style={styles.loadingRow}>
            <ActivityIndicator color={colors.primary} />
            <AppText color={colors.textSecondary} style={styles.loadingText}>
              {t('common.loading')}
            </AppText>
          </View>
        ) : (
          <AppText color={colors.textSecondary}>{t('result.empty')}</AppText>
        )}
      </View>

      {text && !isStreaming ? (
        <View style={styles.actions}>
          <Button
            title={t('common.copy')}
            onPress={handleCopy}
            testID="copy-button"
          />
          <Pressable
            onPress={handleRegenerate}
            style={styles.regenLink}
            testID="regenerate-button"
          >
            <AppText color={colors.primary} variant="caption">
              {t('common.retry')}
            </AppText>
          </Pressable>
        </View>
      ) : null}
    </Screen>
  );
};

const styles = StyleSheet.create({
  title: { marginBottom: spacing.lg },
  card: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: radius.md,
    minHeight: 200,
    marginBottom: spacing.lg,
  },
  text: { lineHeight: 24 },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  loadingText: { marginLeft: spacing.sm },
  actions: { gap: spacing.md },
  regenLink: { alignSelf: 'center', paddingVertical: spacing.sm },
  errorBox: {
    backgroundColor: '#FEE2E2',
    padding: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.md,
  },
  retryButton: { marginTop: spacing.md },
});