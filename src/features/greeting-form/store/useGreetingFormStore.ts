import { create } from 'zustand';
import { INITIAL_FORM_DATA, type IGreetingFormData } from '../types';

interface IGreetingFormStore {
  data: IGreetingFormData;
  setField: <K extends keyof IGreetingFormData>(
    key: K,
    value: IGreetingFormData[K],
  ) => void;
  reset: () => void;
}

export const useGreetingFormStore = create<IGreetingFormStore>((set) => ({
  data: INITIAL_FORM_DATA,
  setField: (key, value) =>
    set((state) => ({ data: { ...state.data, [key]: value } })),
  reset: () => set({ data: INITIAL_FORM_DATA }),
}));