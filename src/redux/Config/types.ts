export const CONFIG_SET = 'config/set';

export type ConfigStrings = { [key: string]: any };

export interface ConfigState {
  year: string;
  strings: null | ConfigStrings;
}
