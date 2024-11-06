import { EditorNodesState, useAppStore } from "../App.store.ts";
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
  if (node === undefined) console.log(node);
  return {
    time: posToTime(node.x),
    note: posToNote(node.y + node.height),
    length: posToTime(node.width),
    chordNotes: posToChordNotes(node.height),
  };
}

export function computeSoundNodeStates(
  nodeStates: EditorNodesState,
): Record<string, SoundNodeState | undefined> {
  return mapObjectValues(
    nodeStates,
    (node) => node && computeSoundNodeState(node),
  );
}

export function subscribeToNodeState(
  id: string,
  cb: (soundNodeState: SoundNodeState | undefined) => void,
) {
  useAppStore.subscribe((state, prevState) => {
    if (state.nodes[id] !== prevState.nodes[id]) {
      const nodeState = state.nodes[id];
      cb(nodeState && computeSoundNodeState(nodeState));
    }
  });
}
