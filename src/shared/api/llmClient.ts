import { ENV } from '@shared/config/env';
import { LLMError, type ILLMClient } from './types';

/**
 * Парсит одну SSE-строку от Groq.
 * Извлекает только `delta.content` (reasoning-токены игнорируются).
 */
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

export const llmClient: ILLMClient = {
  async streamGreeting(prompt, onChunk, signal) {
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
      response = await fetch(`${ENV.API_BASE_URL}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
        signal: combinedSignal,
      });
    } catch (err) {
      clearTimeout(timeoutId);
      if (err instanceof Error && err.name === 'AbortError') {
        throw err;
      }
      throw new LLMError(
        err instanceof Error ? err.message : 'Network request failed',
      );
    }

    if (!response.ok) {
      clearTimeout(timeoutId);
      throw new LLMError(`HTTP ${response.status}`, response.status);
    }

    if (!response.body) {
      clearTimeout(timeoutId);
      throw new LLMError('Response body is empty');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let accumulated = '';

    try {
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

      onChunk({ text: '', done: true });
      return accumulated;
    } finally {
      clearTimeout(timeoutId);
    }
  },
};