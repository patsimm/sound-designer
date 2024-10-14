import { Node, useAppStore } from "../App.store.ts";
import { posToTime } from "./bpm.ts";
import { mapObjectValues } from "../helpers.ts";
import { posToFreq } from "./note.ts";

export type SoundNodeState = {
  time: number;
  length: number;
  freq: number;
};

function computeSoundNodeState(node: Node): SoundNodeState {
  return {
    time: posToTime(node.x),
    freq: posToFreq(node.y + node.height / 2),
    length: posToTime(node.width),
  };
}

export function getSoundNodeStates() {
  const state = useAppStore.getState();

  return mapObjectValues(state.nodes, (node) => computeSoundNodeState(node));
}

export function subscribeToNodeState(
  id: string,
  cb: (soundNodeState: SoundNodeState) => void,
) {
  useAppStore.subscribe((state, prevState) => {
    if (state.nodes[id] !== prevState.nodes[id]) {
      cb(computeSoundNodeState(state.nodes[id]));
    }
  });
}
