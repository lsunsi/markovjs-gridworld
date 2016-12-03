// @flow
import type { State } from './types';

const defeat = (state: State): boolean => state.robson.dead;
const victory = (state: State): boolean => state.goals.length === 0;

export default (state: State): boolean => defeat(state) || victory(state);
export { defeat, victory };
