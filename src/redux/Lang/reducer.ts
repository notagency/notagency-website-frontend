import { CHANGE_LANGUAGE } from './types';
import { Action } from '../types';

const [browserLanguage] = navigator.language.split('-');

const initialState = {
  code: browserLanguage || 'en'
};

export default (state = initialState, action: Action) => {
  switch (action.type) {
    case CHANGE_LANGUAGE:
      return {
        ...state,
        code: action.payload
      };
    default:
      return state;
  }
};
