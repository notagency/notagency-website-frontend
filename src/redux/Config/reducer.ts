import { CONFIG_SET } from './types';
import { Action } from '../types';

const initialState = {
  year: new Date().getFullYear(),
  strings: null
};

export default (state = initialState, action: Action) => {
  switch (action.type) {
    case CONFIG_SET:
      return action.payload;
    default:
      return state;
  }
};
