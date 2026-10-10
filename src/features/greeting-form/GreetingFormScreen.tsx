import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Screen, AppText, Button, Input, LanguageSwitcher } from '@shared/ui';
import { spacing } from '@shared/lib/theme';
import type { TRootStackParamList } from '@app/navigation/types';
import { OptionSelector } from './components/OptionSelector';
import { SwitchRow } from './components/SwitchRow';
import { useGreetingForm } from './hooks/useGreetingForm';
import type { TEventType, TGender } from './types';

type TNav = NativeStackNavigationProp<TRootStackParamList, 'GreetingForm'>;

export const GreetingFormScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<TNav>();
  const { data, errors, setField, onSubmit } = useGreetingForm();

  const handleSubmit = () => {
    const validData = onSubmit();
    if (!validData) return;
    navigation.navigate('GreetingResult', { formData: validData });
  };

  const eventOptions = (
    [
      'birthday',
      'anniversary',
      'wedding',
      'newYear',
      'graduation',
      'other',
    ] as TEventType[]
  ).map(value => ({ value, label: t(`form.events.${value}`) }));

  const genderOptions = (['male', 'female', 'unspecified'] as TGender[]).map(
    value => ({ value, label: t(`form.genders.${value}`) }),
  );

  return (
    <Screen scrollable>
      <LanguageSwitcher />
      <AppText variant="h1" style={styles.title}>
        {t('form.title')}
      </AppText>

      <OptionSelector
        label={t('form.eventLabel')}
        options={eventOptions}
        value={data.event}
        onChange={v => setField('event', v)}
        error={errors.event}
        testID="event-selector"
      />

      {data.event === 'other' ? (
        <Input
          label={t('form.eventCustomLabel')}
          placeholder={t('form.eventCustomPlaceholder')}
          value={data.eventCustom}
          onChangeText={v => setField('eventCustom', v)}
          error={errors.eventCustom}
          testID="event-custom-input"
        />
      ) : null}

      <Input
        label={t('form.recipientName')}
        placeholder={t('form.recipientNamePlaceholder')}
        value={data.recipientName}
        onChangeText={v => setField('recipientName', v)}
        error={errors.recipientName}
        testID="name-input"
      />

      <Input
        label={t('form.relationLabel')}
        placeholder={t('form.relationPlaceholder')}
        value={data.relation}
        onChangeText={v => setField('relation', v)}
        error={errors.relation}
        testID="relation-input"
      />

      <Input
        label={t('form.ageLabel')}
        placeholder={t('form.agePlaceholder')}
        value={data.age}
        onChangeText={v => setField('age', v)}
        keyboardType="number-pad"
        error={errors.age}
        testID="age-input"
      />

      <OptionSelector
        label={t('form.genderLabel')}
        options={genderOptions}
        value={data.gender}
        onChange={v => setField('gender', v)}
        testID="gender-selector"
      />

      <View style={styles.switches}>
        <SwitchRow
          label={t('form.hasChildren')}
          value={data.hasChildren}
          onChange={v => setField('hasChildren', v)}
          testID="has-children-switch"
        />
        <SwitchRow
          label={t('form.hasGrandchildren')}
          value={data.hasGrandchildren}
          onChange={v => setField('hasGrandchildren', v)}
          testID="has-grandchildren-switch"
        />
      </View>

      <Input
        label={t('form.wishesLabel')}
        placeholder={t('form.wishesPlaceholder')}
        value={data.wishes}
        onChangeText={v => setField('wishes', v)}
        multiline
        numberOfLines={4}
        style={styles.textarea}
        testID="wishes-input"
      />

      <Button
        title={t('common.generate')}
        onPress={handleSubmit}
        testID="submit-button"
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  title: { marginBottom: spacing.lg },
  switches: { marginBottom: spacing.md },
  textarea: { minHeight: 100, textAlignVertical: 'top' },
});