import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useGreetingFormStore } from '../store/useGreetingFormStore';
import { validateGreetingForm, isFormValid } from '../lib/validate';
import type { IGreetingFormData, TGreetingFormErrors } from '../types';

interface IUseGreetingFormResult {
  data: IGreetingFormData;
  errors: TGreetingFormErrors;
  setField: <K extends keyof IGreetingFormData>(
    key: K,
    value: IGreetingFormData[K],
  ) => void;
  onSubmit: () => IGreetingFormData | null;
  resetErrors: () => void;
}

export const useGreetingForm = (): IUseGreetingFormResult => {
  const { t } = useTranslation();
  const { data, setField } = useGreetingFormStore();
  const [errors, setErrors] = useState<TGreetingFormErrors>({});

  const onSubmit = useCallback((): IGreetingFormData | null => {
    const nextErrors = validateGreetingForm(data, t);
    setErrors(nextErrors);
    return isFormValid(nextErrors) ? data : null;
  }, [data, t]);

  const resetErrors = useCallback(() => setErrors({}), []);

  return { data, errors, setField, onSubmit, resetErrors };
};