// src/shared/api/rnFetch.d.ts

/**
 * react-native-fetch-api не поставляет TypeScript-типы.
 * Объявляем модуль вручную.
 */
declare module 'react-native-fetch-api' {
  export interface IRNFetchInit extends RequestInit {
    reactNative?: {
      textStreaming?: boolean;
    };
  }

  export function fetch(
    input: RequestInfo | URL,
    init?: IRNFetchInit,
  ): Promise<Response>;
}