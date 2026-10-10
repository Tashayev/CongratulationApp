export type TEventType =
  | 'birthday'
  | 'anniversary'
  | 'wedding'
  | 'newYear'
  | 'graduation'
  | 'other';

export type TRelationType =
  | 'friend'
  | 'colleague'
  | 'family'
  | 'relative'
  | 'boss'
  | 'other';

export type TGender = 'male' | 'female' | 'unspecified';

export interface IGreetingFormData {
  event: TEventType | null;
  recipientName: string;
  relation: TRelationType | null;
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
  recipientName: '',
  relation: null,
  age: '',
  gender: 'unspecified',
  hasChildren: false,
  hasGrandchildren: false,
  wishes: '',
};