// @flow
import type { Action } from './types';
import { ACTIONS } from './constants';

export default (): Array<Action> => (Object.values(ACTIONS): any);
