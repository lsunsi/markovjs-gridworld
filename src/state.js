// @flow
import type { State } from './types';

const proto = {
  toString(): string {
    const { goals, robson: { r, c, dead } } = (this: State);
    return [goals, r, c, dead].toString();
  },
};

const create = (state: State): State => (Object.assign(Object.create(proto), state): any);

const init = (
  [rows, cols]: [number, number],
  [r, c]: [number, number],
  goals: Array<[number, number]>,
  hazards: Array<[number, number]>,
): State => create({
  board: { rows, cols },
  robson: { r, c, dead: false },
  goals: goals.map(g => (g[0] * cols) + g[1]),
  hazards: hazards.map(h => (h[0] * cols) + h[1]),
});

export { init, create };
