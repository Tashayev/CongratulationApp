// src/shared/api/llmClient.ts
import { fetch as streamingFetch } from 'react-native-fetch-api';
import { ENV } from '@shared/config/env';
import { LLMError, type ILLMClient, type IStreamChunk } from './types';

const parseSSELine = (line: string): string | null => {
  const trimmed = line.trim();
  if (!trimmed.startsWith('data:')) return null;

  const payload = trimmed.slice(5).trim();
  if (payload === '[DONE]') return null;

  try {
    const json = JSON.parse(payload);
    return json.choices?.[0]?.delta?.content ?? null;
  } catch {
    return null;
  }
};

/**
 * Потоковое чтение — работает, если react-native-fetch-api отдал ReadableStream.
 */
const readAsStream = async (
  response: Response,
  onChunk: (chunk: IStreamChunk) => void,
): Promise<string> => {
  const reader = response.body!.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let accumulated = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() ?? '';

    for (const line of lines) {
      const text = parseSSELine(line);
      if (text) {
        accumulated += text;
        onChunk({ text, done: false });
      }
    }
  }

  // Обработка остатка буфера
  if (buffer.trim()) {
    const text = parseSSELine(buffer);
    if (text) {
      accumulated += text;
      onChunk({ text, done: false });
    }
  }

  onChunk({ text: '', done: true });
  return accumulated;
};

/**
 * Fallback — если стриминг недоступен, ждём полный ответ и парсим SSE из строки.
 * Текст появится одним блоком, но всё работает.
 */
const readAsText = async (
  response: Response,
  onChunk: (chunk: IStreamChunk) => void,
): Promise<string> => {
  const fullText = await response.text();
  const lines = fullText.split('\n');
  let accumulated = '';

  for (const line of lines) {
    const text = parseSSELine(line);
    if (text) {
      accumulated += text;
      onChunk({ text, done: false });
    }
  }

  onChunk({ text: '', done: true });
  return accumulated;
};

export const llmClient: ILLMClient = {
  async streamGreeting(prompt, systemPrompt, onChunk, signal) {
    const timeoutController = new AbortController();
    const timeoutId = setTimeout(
      () => timeoutController.abort(),
      ENV.REQUEST_TIMEOUT_MS,
    );

    const combinedSignal = signal
      ? AbortSignal.any([signal, timeoutController.signal])
      : timeoutController.signal;

    let response: Response;
    try {
      response = await streamingFetch(`${ENV.API_BASE_URL}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, systemPrompt }),
        signal: combinedSignal,
        reactNative: { textStreaming: true },
      } as RequestInit);
    } catch (err) {
      clearTimeout(timeoutId);
      if (err instanceof Error && err.name === 'AbortError') throw err;
      throw new LLMError(
        err instanceof Error ? err.message : 'Network request failed',
      );
    }

    if (!response.ok) {
      clearTimeout(timeoutId);
      throw new LLMError(`HTTP ${response.status}`, response.status);
    }

    try {
      // Если есть ReadableStream — используем стриминг,
      // иначе — читаем как текст и парсим SSE построчно.
      if (response.body && typeof response.body.getReader === 'function') {
        return await readAsStream(response, onChunk);
      }
      return await readAsText(response, onChunk);
    } finally {
      clearTimeout(timeoutId);
    }
  },
};