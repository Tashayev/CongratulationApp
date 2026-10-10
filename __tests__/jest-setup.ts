import { cleanup } from '@testing-library/react-native';

afterEach(() => {
  cleanup();
});

jest.mock('react-native-localize', () => ({
  findBestLanguageTag: jest.fn(() => ({ languageTag: 'en' })),
}));