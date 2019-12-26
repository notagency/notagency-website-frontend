import { State } from '../types';
import { selectLangCode } from '../Lang/selectors';

export const selectYear = (state: State) => state.config.year;

export const selectStrings = (state: State) => {
  const langCode = selectLangCode(state);
  if (state.config.strings && langCode && state.config.strings[langCode]) {
    return state.config.strings[langCode];
  }
  return null;
};
