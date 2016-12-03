import markov from 'markovjs';
import * as memory from 'markovjs/memory';
import { egreedy, greedy } from 'markovjs/policies';

import * as format from './format';
import * as state from './state';
import actions from './actions';
import reward from './reward';
import final from './final';
import act from './act';

const game = { actions, reward, final, act };
const initial = state.init(
  [3, 3], // board
  [0, 0], // robson
  [[0, 2]], // goals
  [[0, 1]], // hazards
);

const α = 0.9; // learning rate
const γ = 0.9; // discount factor
const ε = 0.1; // exploration rate

markov()
  .memory(memory, memory.init(0.0))
  .policies(egreedy(ε), greedy)
  .game(game, initial)
  .train(1000, α, γ)
  .play(e => // eslint-disable-next-line no-console
    console.log(format.episode(e)),
  );
