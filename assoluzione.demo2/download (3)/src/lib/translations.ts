import type { Language } from './types';

const translations = {
  it: {
    next: 'Prossimo',
    submit: 'Invia',
    yourAnswer: 'La tua risposta...',
    booleanYes: 'Sì',
    booleanNo: 'No',
    showFact: 'Mostra il Dato',
    hideFact: 'Nascondi il Dato',
    fact: 'Dato:',
    finishConfession: 'Termina la Confessione',
  },
  en: {
    next: 'Next',
    submit: 'Submit',
    yourAnswer: 'Your answer...',
    booleanYes: 'Yes',
    booleanNo: 'No',
    showFact: 'Show the Fact',
    hideFact: 'Hide the Fact',
    fact: 'Fact:',
    finishConfession: 'Finish Confession',
  }
};

export const t = (key: keyof typeof translations.en, lang: Language) => {
  return translations[lang][key] || translations.en[key];
};
