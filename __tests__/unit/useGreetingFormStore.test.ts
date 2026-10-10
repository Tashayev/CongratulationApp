// __tests__/unit/useGreetingFormStore.test.ts
import { useGreetingFormStore } from '@features/greeting-form/store/useGreetingFormStore';
import { INITIAL_FORM_DATA } from '@features/greeting-form/types';

describe('useGreetingFormStore', () => {
  beforeEach(() => {
    useGreetingFormStore.getState().reset();
  });

  it('sets field value', () => {
    useGreetingFormStore.getState().setField('recipientName', 'Anna');
    expect(useGreetingFormStore.getState().data.recipientName).toBe('Anna');
  });

  it('resets to initial state', () => {
    useGreetingFormStore.getState().setField('recipientName', 'Anna');
    useGreetingFormStore.getState().reset();
    expect(useGreetingFormStore.getState().data).toEqual(INITIAL_FORM_DATA);
  });
});