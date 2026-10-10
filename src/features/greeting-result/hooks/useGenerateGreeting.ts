import { useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { llmClient } from '@shared/api/llmClient';
import type { IGreetingFormData } from '@features/greeting-form/types';
import {
  buildPrompt,
  getSystemPrompt,
} from '@features/greeting-form/lib/buildPrompt';
import type { TLanguage } from '@i18n/const';
import { LLMError } from '@/shared/api/types';

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
  const { i18n } = useTranslation();

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
        const lang = i18n.language as TLanguage;
        const prompt = buildPrompt(data, lang);
        const systemPrompt = getSystemPrompt(lang);

        await llmClient.streamGreeting(
          prompt,
          systemPrompt, // ⚠️ нужно передать и в Worker
          chunk => {
            if (!chunk.done) setText(prev => prev + chunk.text);
          },
          controller.signal,
        );
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          return;
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
    [cancel, reset, i18n.language],
  );

  return { text, isStreaming, error, generate, cancel, reset };
};
