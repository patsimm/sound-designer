import { Node, State, useAppStore } from "../App.store.ts";
import { factor } from "./bpm.ts";
import { mapObjectValues } from "../helpers.ts";

export type SoundNodeState = {
  pos: number;
  freq: number;
};

function computeSoundNodeState(node: Node, state: State): SoundNodeState {
  return {
    pos: (node.x / state.size[0]) * factor,
    freq: 100 + ((state.size[1] - node.y) / state.size[1]) * 800,
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
