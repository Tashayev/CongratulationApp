import type { IGreetingFormData } from '../types';

/**
 * Превращает данные формы в промпт для LLM.
 * Пишем на русском — модель отвечает на русском.
 */
export const buildPrompt = (data: IGreetingFormData): string => {
  const parts: string[] = [];

  const eventLabels: Record<string, string> = {
    birthday: 'днём рождения',
    anniversary: 'юбилеем',
    wedding: 'свадьбой',
    newYear: 'Новым годом',
    graduation: 'выпускным',
    other: 'торжественным событием',
  };

  const relationLabels: Record<string, string> = {
    friend: 'друг',
    colleague: 'коллега',
    family: 'родственник',
    relative: 'близкий человек',
    boss: 'руководитель',
    other: 'знакомый',
  };

  const genderLabels: Record<string, string> = {
    male: 'мужчина',
    female: 'женщина',
    unspecified: 'человек',
  };

  const event = data.event ? eventLabels[data.event] ?? 'событие' : 'событие';
  parts.push(`Поздравь ${data.recipientName.trim()} с ${event}.`);

  if (data.relation) {
    parts.push(`Это мой ${relationLabels[data.relation] ?? 'знакомый'}.`);
  }

  if (data.age) {
    parts.push(`Возраст: ${data.age} лет.`);
  }

  if (data.gender !== 'unspecified') {
    parts.push(`Пол: ${genderLabels[data.gender]}.`);
  }

  if (data.hasChildren) {
    parts.push('У него/неё есть дети.');
  }

  if (data.hasGrandchildren) {
    parts.push('У него/неё есть внуки.');
  }

  if (data.wishes.trim()) {
    parts.push(`Обязательно упомяни: ${data.wishes.trim()}.`);
  }

  parts.push(
    'Напиши тёплое, искреннее поздравление на русском языке. Длина — 4-6 предложений. Без markdown, без заголовков.',
  );

  return parts.join(' ');
};