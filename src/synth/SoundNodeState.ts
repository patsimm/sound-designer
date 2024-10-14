import { Node, State, useAppStore } from "../App.store.ts";
import { posToTime } from "./bpm.ts";
import { mapObjectValues } from "../helpers.ts";

export type SoundNodeState = {
  time: number;
  length: number;
  freq: number;
};

function computeSoundNodeState(node: Node, state: State): SoundNodeState {
  return {
    time: posToTime(node.x),
    freq: 100 + ((state.size[1] - node.y) / state.size[1]) * 800,
    length: posToTime(node.width),
  };
}

export function getSoundNodeStates() {
  const state = useAppStore.getState();

  return mapObjectValues(state.nodes, (node) =>
    computeSoundNodeState(node, state),
  );
}

export function subscribeToNodeState(
  id: string,
  cb: (soundNodeState: SoundNodeState) => void,
) {
  useAppStore.subscribe((state, prevState) => {
    if (state.nodes[id] !== prevState.nodes[id]) {
      cb(computeSoundNodeState(state.nodes[id], state));
    }
  });
}
