// @flow
import type { State } from './types';

export default (state: State, prevState: State): number =>
  prevState.goals.length - state.goals.length
  - (state.robson.dead ? 1 : 0)
  - 0.01;
