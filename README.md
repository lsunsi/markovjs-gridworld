# markovjs-gridworld

[![Release](https://img.shields.io/badge/Release-0.1.1-blue.svg?style=flat-square)](https://github.com/lsunsi/markovjs-gridworld/releases)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](https://github.com/lsunsi/markovjs-gridworld/blob/master/LICENSE)

This is a game implementation example for the package [markovjs](https://github.com/lsunsi/markovjs).

The game is *Grid World*, a popular toy problem for artificial intelligence search algorithms.
Many people would say this game is just a simple graph maze. **They would be wrong**.

This game is about a robot named Robson and his search for love while trying to avoid death. *relatable?*

## Rules

- This is Robson: 🤖. *Say hi!*
- Like we all, he wants ❤. Finding it makes him feel rewarded. He wins the game if there's no more to find.
- 💀 can't be good, right? *Right*. Touching it kills Robson. He feels punished when this happens, *as he should*.
- The world is a grid where Robson can move freely, where freely means `↓, ←, → or ↑`.

The grid layout is customizable: number of rows and columns, where the ❤s and 💀s are, etc.
The default example looks like that:

```
🤖 💀 ❤
⬚ ⬚ ⬚
⬚ ⬚ ⬚
```

Let's just hope Robson knows better to not go → right away.

## Implementation
This is where I'm gonna comment the actual code.
Turns out it's pretty basic, so don't worry.

### State type [¹](src/types.js) [²](src/state.js)
The state type must code all information needed for the game functions to work.
That doesn't mean the agent should include it all in it's observation of the state.
What the agent observes is the state subset it learns to act in.

This is what the state type looks like:
```javascript
type State = {
  robson: { r: number, c: number, dead: boolean }, // where he is and whether he's dead
  board: { rows: number, cols: number }, // total number of rows and columns
  hazards: Array<number>, // where the hazards are
  goals: Array<number> // where the goals are
}
```

Since we're using the `markovjs` default memory implementation, the agent observation is implemented via `toString` function.
Note that the observation doesn't include static state information, like the board or hazards.
This won't impact in the search behavior we want, so the agent doesn't need to know it.

```javascript
function toString(): string {
  const { goals, robson: { r, c, dead } } = (this: State);
  return [goals, r, c, dead].toString();
}
```

### Actions function [¹](src/actions.js)
This function returns which actions can be taken by the agent in each state.
In this example, we just returned all actions for any state.

```javascript
function actions(): Array<Action> {
  return ['↓', '←', '→', '↑'];
}
```

Although this implementation is quite trivial, this function could be used to optimize learning by filtering the action pool to include only useful actions.
For example, if you know that movement against the grid walls doesn't change the state, you could filter this actions out in these situations.
That said, you should be careful not to taint the agent with your knowledge from the problem. *You're just a human, you do not know better*

### Act function [¹](src/act.js)
This function maps a state and action to the next state.
In this example, we just apply the action to the agents `r` and `c` properties, considering some special cases:
- If the resulting agent's position includes a goal, it is removed from the goals array.
- If the resulting agent's position includes a hazard, the `dead` property is set on the agent.
- If the resulting agent's position is off grid bounds, it is just ignored and the last one is used.

One detail: if the agent is `dead`, it shouldn't `act` anymore.
Calling this function with a dead agent state might reanimate it, *and zombies are beyond this implementation intentions*.

### Reward function [¹](src/reward.js)
This function rewards or punishes the agent for some experience.
In this example this function considers three components:
- If the agent found a new goal, it is **rewarded** (+1) *because love feels nice*
- If the agent died, it is **punished** (-1) *because dying doesn't*
- If the agent did anything, it is **punished** (-0.01) *because there's no such thing as a free lunch*

```javascript
const reward = (state: State, prevState: State): number =>
  prevState.goals.length - state.goals.length
  - (state.robson.dead ? 1 : 0)
  - 0.01;
```

It might seem mean to punish the agent for no reason, right?
Turns out we don't want to foster a lazy behavior, so we need this.
The values were all chosen arbitrarily and changing them changes the way the agent learns.

### Final function [¹](src/final.js)
This function just says if the game is over or not.
In this example we consider a state:
- a win if there's no more love to find
- a loss if there's no more Robson

A final state is just a state that is a win or a loss.

```javascript
const defeat = (state: State): boolean => state.robson.dead;
const victory = (state: State): boolean => state.goals.length === 0;

const final = (state: State): boolean => defeat(state) || victory(state);
```

## Result
- Initial values: **0.0**
- Learning rate: **90%**
- Discount factor: **90%**
- Exploration rate: **10%**
- Training sessions: **10**
- Q-Learning
```
↓ 💀 ❤
🤖 ⬚ ⬚
⬚ ⬚ ⬚
```
```
⬚ 💀 ❤
→ 🤖 ⬚
⬚ ⬚ ⬚
```
```
⬚ 💀 ❤
⬚ → 🤖
⬚ ⬚ ⬚
```
```
⬚ 💀 🤖
⬚ ⬚ ↑
⬚ ⬚ ⬚
```
## Considerations
Of course this is a silly example, but it should help you get used to the abstractions proposed by `markovjs`.

I encourage you to clone this repository and play around with the implementation.
There's actually a bunch of stuff to try out, for example:
- Different layouts (move love, bigger grid, death all around, etc)
- Different reward function (how does it impact learning?)
- Different observation function (how does it impact learning generality?)
- Different parameters

## Thanks
To you, for reading, sure.
But mainly to Robson. He made this all possible.

*May his deaths be meaningful and help him find love!*
