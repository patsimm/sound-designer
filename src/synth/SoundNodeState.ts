import { useAppStore } from "../App.store.ts";
import { posToTime } from "./bpm.ts";
import { mapObjectValues } from "../helpers.ts";
import { posToChordNotes, posToNote } from "./note.ts";
import { EditorNode } from "../editor/entities.ts";

export type SoundNodeState = {
  time: number;
  length: number;
  note: string;
  chordNotes: number;
};

function computeSoundNodeState(node: EditorNode): SoundNodeState {
  return {
    time: posToTime(node.x),
    note: posToNote(node.y + node.height),
    length: posToTime(node.width),
    chordNotes: posToChordNotes(node.height),
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
