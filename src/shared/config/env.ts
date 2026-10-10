/**
 * URL Cloudflare Worker — прокси для Groq API.
 * API-ключ хранится в секретах Cloudflare, а не в приложении.
 */
export const ENV = {
  API_BASE_URL: 'https://congratulation-proxy.ubiicakozlov.workers.dev',
  REQUEST_TIMEOUT_MS: 60_000,
} as const;