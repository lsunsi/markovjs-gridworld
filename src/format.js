import { ENTITIES } from './constants';

const stateTokenizer = ({
  goals,
  hazards,
  board: { rows, cols },
  robson: { r, c, dead },
}) =>
  [...Array(rows).keys()].map((row: number) =>
    [...Array(cols).keys()].map((col: number) => (
          r === row && c === col && !dead ? ENTITIES.ROBSON
        : goals.includes((row * cols) + col) ? ENTITIES.GOAL
        : hazards.includes((row * cols) + col) ? ENTITIES.HAZARD
        : ENTITIES.EMPTY
      ),
    ),
  );

const transitionTokenizer = ({
  action,
  gameState: { robson: { r, c } },
  nextGameState,
}) => {
  const tokens = stateTokenizer(nextGameState);
  tokens[r][c] = action;
  return tokens;
};

const state = s => stateTokenizer(s).map(a => a.join(' ')).join('\n');
const transition = t => transitionTokenizer(t).map(a => a.join(' ')).join('\n');
const episode = e => [...e].map(t => transition(t)).join('\n\n');

export {
  state,
  transition,
  episode,
};
