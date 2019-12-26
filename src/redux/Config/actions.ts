import { CONFIG_SET, ConfigState } from './types';

export const configSet = (config: ConfigState) => {
  return { type: CONFIG_SET, payload: config };
};
