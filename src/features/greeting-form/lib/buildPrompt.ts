import type { IGreetingFormData } from '../types';
import type { TLanguage } from '@i18n/const';

interface IPromptLabels {
  event: Record<string, string>;
  intro: (name: string, event: string) => string;
  relation: (rel: string) => string;
  gender: Record<string, string>;
  instruction: string;
  dateInstruction: (dateStr: string) => string;
  ageLabel: string;
  childrenLabel: string;
  grandchildrenLabel: string;
  wishesLabel: string;
  systemPrompt: string;
}

const getCurrentDate = (lang: TLanguage): string => {
  const now = new Date();

  const localeMap: Record<TLanguage, string> = {
    ru: 'ru-RU',
    en: 'en-US',
    kz: 'kk-KZ',
  };

  const formattedDate = new Intl.DateTimeFormat(localeMap[lang] || 'ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(now);

  return lang === 'ru' ? `${formattedDate} года` : formattedDate;
};

const LABELS: Record<TLanguage, IPromptLabels> = {
  ru: {
    event: {
      birthday: 'днём рождения',
      anniversary: 'юбилеем',
      wedding: 'свадьбой',
      newYear: 'Новым годом',
      graduation: 'выпускным',
      other: 'торжественным событием',
    },
    intro: (name, event) => `Поздравь ${name} с ${event}.`,
    relation: (rel) => `Это мой(я) ${rel}.`,
    gender: { male: 'мужчина', female: 'женщина', unspecified: 'человек' },
    instruction:
      'Напиши тёплое, искреннее поздравление на русском языке. Длина — 4-6 предложений. Без markdown.',
    dateInstruction: dateStr =>
      `Сегодня ${dateStr}. Если упоминаешь год — используй только актуальный.`,
    ageLabel: 'Возраст',
    childrenLabel: 'У него/неё есть дети.',
    grandchildrenLabel: 'У него/неё есть внуки.',
    wishesLabel: 'Обязательно упомяни',
    systemPrompt:
      'Ты — опытный поэт и автор поздравлений. Пиши тепло, искренне, на русском языке.',
  },
  en: {
    event: {
      birthday: 'birthday',
      anniversary: 'anniversary',
      wedding: 'wedding',
      newYear: 'New Year',
      graduation: 'graduation',
      other: 'special occasion',
    },
    intro: (name, event) => `Congratulate ${name} on their ${event}.`,
    relation: (rel) => `This is my ${rel}.`,
    gender: { male: 'male', female: 'female', unspecified: 'person' },
    instruction:
      'Write a warm, sincere congratulation in English. 4-6 sentences. No markdown.',
    dateInstruction: dateStr =>
      `Today is ${dateStr}. If you mention a year, use only the current one.`,
    ageLabel: 'Age',
    childrenLabel: 'They have children.',
    grandchildrenLabel: 'They have grandchildren.',
    wishesLabel: 'Be sure to mention',
    systemPrompt:
      'You are an experienced poet and greeting writer. Write warmly and sincerely in English.',
  },
  kz: {
    event: {
      birthday: 'туған күнімен',
      anniversary: 'мерейтойымен',
      wedding: 'үйлену тойымен',
      newYear: 'Жаңа жылмен',
      graduation: 'түлек кешімен',
      other: 'ерекше оқиғамен',
    },
    intro: (name, event) => `${name} адамды ${event} құттықта.`,
    relation: (rel) => `Ол менің ${rel}.`,
    gender: { male: 'ер', female: 'әйел', unspecified: 'адам' },
    instruction:
      'Қазақ тілінде жылы, шынайы құттықтау жаз. Ұзындығы — 4-6 сөйлем. Markdownсыз.',
    dateInstruction: dateStr =>
      `Бүгін ${dateStr}. Жылды атап өтетін болсаң — тек ағымдағы жылды пайдалан.`,
    ageLabel: 'Жасы',
    childrenLabel: 'Оның балалары бар.',
    grandchildrenLabel: 'Оның немерелері бар.',
    wishesLabel: 'Міндетті түрде атап өт',
    systemPrompt:
      'Сен — тәжірибелі ақын және құттықтау авторысың. Қазақ тілінде жылы, шынайы жаз.',
  },
};

export const buildPrompt = (
  data: IGreetingFormData,
  language: TLanguage = 'ru',
): string => {
  const L = LABELS[language];
  const parts: string[] = [];

  // 1. Событие: если выбрано "other" и есть свой текст — используем его,
  //    иначе берём локализованный пресет.
  let eventLabel: string;
  if (data.event === 'other' && data.eventCustom?.trim()) {
    eventLabel = data.eventCustom.trim();
  } else if (data.event) {
    eventLabel = L.event[data.event] ?? data.event;
  } else {
    eventLabel = language === 'ru' ? 'событие' : language === 'en' ? 'event' : 'оқиға';
  }

  parts.push(L.intro(data.recipientName.trim(), eventLabel));

  // 2. Связь: свободный ввод ("мама", "брат и сестра", "друг, коллега")
  if (data.relation.trim()) {
    parts.push(L.relation(data.relation.trim()));
  }

  if (data.age) {
    parts.push(`${L.ageLabel}: ${data.age}.`);
  }

  if (data.gender !== 'unspecified') {
    parts.push(`${L.gender}: ${L.gender[data.gender]}.`);
  }

  if (data.hasChildren) parts.push(L.childrenLabel);
  if (data.hasGrandchildren) parts.push(L.grandchildrenLabel);

  if (data.wishes.trim()) {
    parts.push(`${L.wishesLabel}: ${data.wishes.trim()}.`);
  }

  const currentDate = getCurrentDate(language);
  parts.push(L.dateInstruction(currentDate));
  parts.push(L.instruction);

  return parts.join(' ');
};

export const getSystemPrompt = (language: TLanguage = 'ru'): string =>
  LABELS[language].systemPrompt;