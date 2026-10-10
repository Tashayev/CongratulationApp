import type { TFunction } from 'i18next';
import type { IGreetingFormData, TGreetingFormErrors } from '../types';

export const validateGreetingForm = (
  data: IGreetingFormData,
  t: TFunction,
): TGreetingFormErrors => {
  const errors: TGreetingFormErrors = {};

  if (!data.recipientName.trim()) {
    errors.recipientName = t('errors.nameRequired');
  } else if (data.recipientName.trim().length < 2) {
    errors.recipientName = t('errors.nameTooShort');
  }

  if (!data.event) {
    errors.event = t('errors.eventRequired');
  }

  if (data.age) {
    const ageNum = Number(data.age);
    if (Number.isNaN(ageNum) || ageNum < 0 || ageNum > 150) {
      errors.age = t('errors.ageInvalid');
    }
  }

  return errors;
};

export const isFormValid = (errors: TGreetingFormErrors): boolean =>
  Object.keys(errors).length === 0;