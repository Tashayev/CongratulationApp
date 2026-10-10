export type TEventType =
  | 'birthday'
  | 'anniversary'
  | 'wedding'
  | 'newYear'
  | 'graduation'
  | 'other';

export type TGender = 'male' | 'female' | 'unspecified';

export interface IGreetingFormData {
  event: TEventType | null;
  eventCustom: string;
  recipientName: string;
  relation: string;
  age: string;
  gender: TGender;
  hasChildren: boolean;
  hasGrandchildren: boolean;
  wishes: string;
}

export type TGreetingFormErrors = Partial<
  Record<keyof IGreetingFormData, string>
>;

export const INITIAL_FORM_DATA: IGreetingFormData = {
  event: null,
  eventCustom: '',
  recipientName: '',
  relation: '',
  age: '',
  gender: 'unspecified',
  hasChildren: false,
  hasGrandchildren: false,
  wishes: '',
};