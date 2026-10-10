import React from 'react';
import { useTranslation } from 'react-i18next';
import { Screen, AppText } from '@shared/ui';

export const GreetingResultScreen: React.FC = () => {
  const { t } = useTranslation();
  return (
    <Screen>
      <AppText variant="h1">{t('result.title')}</AppText>
    </Screen>
  );
};