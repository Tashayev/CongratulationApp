import type { IGreetingFormData } from '@features/greeting-form/types';

export type TRootStackParamList = {
  GreetingForm: undefined;
  GreetingResult: { formData: IGreetingFormData };
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends TRootStackParamList {}
  }
}