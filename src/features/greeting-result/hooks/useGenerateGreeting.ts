import { useCallback, useRef, useState } from 'react';
import { llmClient } from '@shared/api/llmClient';
import { LLMError } from '@shared/api/types';
import type { IGreetingFormData } from '@features/greeting-form/types';
import { buildPrompt } from '@features/greeting-form/lib/buildPrompt';

interface IUseGenerateGreetingResult {
  text: string;
  isStreaming: boolean;
  error: string | null;
  generate: (data: IGreetingFormData) => Promise<void>;
  cancel: () => void;
  reset: () => void;
}

export const useGenerateGreeting = (): IUseGenerateGreetingResult => {
  const [text, setText] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const cancel = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setIsStreaming(false);
  }, []);

  const reset = useCallback(() => {
    setText('');
    setError(null);
    setIsStreaming(false);
  }, []);

  const generate = useCallback(
    async (data: IGreetingFormData) => {
      cancel();
      reset();

      const controller = new AbortController();
      abortRef.current = controller;
      setIsStreaming(true);

      try {
        const prompt = buildPrompt(data);
        await llmClient.streamGreeting(
          prompt,
          (chunk) => {
            if (!chunk.done) {
              setText((prev) => prev + chunk.text);
            }
          },
          controller.signal,
        );
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          return; // Отмена — не ошибка
        }
        if (err instanceof LLMError) {
          setError(err.message);
        } else {
          setError(err instanceof Error ? err.message : 'Unknown error');
        }
      } finally {
        setIsStreaming(false);
        abortRef.current = null;
      }
    },
    [cancel, reset],
  );

  return { text, isStreaming, error, generate, cancel, reset };
};