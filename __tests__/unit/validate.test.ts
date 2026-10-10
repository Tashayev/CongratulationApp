import { validateGreetingForm, isFormValid } from '@features/greeting-form/lib/validate';
import { INITIAL_FORM_DATA } from '@features/greeting-form/types';

const t = ((key: string) => key) as any;

describe('validateGreetingForm', () => {
  it('returns nameRequired when name is empty', () => {
    const errors = validateGreetingForm(INITIAL_FORM_DATA, t);
    expect(errors.recipientName).toBe('errors.nameRequired');
  });

  it('returns eventRequired when event is null', () => {
    const errors = validateGreetingForm(INITIAL_FORM_DATA, t);
    expect(errors.event).toBe('errors.eventRequired');
  });

  it('returns ageInvalid for non-numeric age', () => {
    const errors = validateGreetingForm(
      {
        ...INITIAL_FORM_DATA,
        recipientName: 'Anna',
        event: 'birthday',
        age: 'abc',
      },
      t,
    );
    expect(errors.age).toBe('errors.ageInvalid');
  });

  it('passes for valid data', () => {
    const errors = validateGreetingForm(
      {
        ...INITIAL_FORM_DATA,
        recipientName: 'Anna',
        event: 'birthday',
        age: '30',
      },
      t,
    );
    expect(isFormValid(errors)).toBe(true);
  });
});