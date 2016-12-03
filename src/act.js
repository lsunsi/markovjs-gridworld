// @flow
import type { Action, State } from './types';
import { ACTIONS } from './constants';
import { create } from './state';

export default (
  {
    board,
    robson: { r, c },
    goals,
    hazards,
  }: State,
  action: Action,
): State => {
  const dr = {
    [ACTIONS.UP]: -1,
    [ACTIONS.DOWN]: +1,
  }[action] || 0;

  const dc = {
    [ACTIONS.LEFT]: -1,
    [ACTIONS.RIGHT]: +1,
  }[action] || 0;

  const nextR = r + dr === -1 || r + dr === board.rows ? r : r + dr;
  const nextC = c + dc === -1 || c + dc === board.cols ? c : c + dc;

  const index = (nextR * board.cols) + nextC;
  const nextDead = hazards.includes(index);
  const nextGoals = goals.filter(g => g !== index);

  return create({
    robson: { r: nextR, c: nextC, dead: nextDead },
    goals: nextGoals,
    hazards,
    board,
  });
};
