import { combineReducers } from 'redux';
import config from './Config/reducer';
import lang from './Lang/reducer';

export default combineReducers({
  config,
  lang
});
