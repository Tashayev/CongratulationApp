import { cleanup } from '@testing-library/react-native';
import i18n from '../src/i18n/i18n';

i18n.changeLanguage('en');

afterEach(() => {
  cleanup();
});

jest.mock('react-native-localize', () => ({
  findBestLanguageTag: jest.fn(() => ({ languageTag: 'en' })),
}));