// @flow
import type { Action, Entity } from './types';

const ACTIONS: { [string]: Action } = {
  DOWN: '↓',
  LEFT: '←',
  RIGHT: '→',
  UP: '↑',
};

const ENTITIES: { [string]: Entity } = {
  EMPTY: '⬚',
  GOAL: '❤',
  HAZARD: '💀',
  ROBSON: '🤖',
};

export { ACTIONS, ENTITIES };
