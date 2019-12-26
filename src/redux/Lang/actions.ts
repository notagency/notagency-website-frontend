import { CHANGE_LANGUAGE } from './types';

export const changeLanguage = (lang: string) => {
  return { type: CHANGE_LANGUAGE, payload: lang };
};
