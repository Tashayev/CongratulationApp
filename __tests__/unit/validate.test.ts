import {
  validateGreetingForm,
  isFormValid,
} from '@features/greeting-form/lib/validate';
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

  it('returns relationRequired when relation is empty', () => {
    const errors = validateGreetingForm(
      {
        ...INITIAL_FORM_DATA,
        recipientName: 'Anna',
        event: 'birthday',
      },
      t,
    );
    expect(errors.relation).toBe('errors.relationRequired');
  });

  it('returns eventCustomRequired when event is other and custom is empty', () => {
    const errors = validateGreetingForm(
      {
        ...INITIAL_FORM_DATA,
        recipientName: 'Anna',
        event: 'other',
        eventCustom: '',
        relation: 'friend',
      },
      t,
    );
    expect(errors.eventCustom).toBe('errors.eventCustomRequired');
  });

  it('returns ageInvalid for non-numeric age', () => {
    const errors = validateGreetingForm(
      {
        ...INITIAL_FORM_DATA,
        recipientName: 'Anna',
        event: 'birthday',
        relation: 'friend',
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
        relation: 'friend',
        age: '30',
      },
      t,
    );
    expect(isFormValid(errors)).toBe(true);
  });

  it('passes when event is other with custom text', () => {
    const errors = validateGreetingForm(
      {
        ...INITIAL_FORM_DATA,
        recipientName: 'Anna',
        event: 'other',
        eventCustom: 'повышение на работе',
        relation: 'коллега',
      },
      t,
    );
    expect(isFormValid(errors)).toBe(true);
  });
});