import { Action as ReduxAction } from 'redux';
import { ConfigState } from './Config/types';
import { LangState } from './Lang/types';

export interface State {
  config: ConfigState;
  lang: LangState;
}

export interface Action extends ReduxAction {
  payload: any;
}
