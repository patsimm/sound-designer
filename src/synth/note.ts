import * as Scale from "@tonaljs/scale";
import { useAppStore } from "../App.store.ts";

const availableNotes = 24;
const base = 0;

const c4major = Scale.steps("C4 mixolydian");

export function posToNote(pos: number) {
  const { editorSize } = useAppStore.getState();
  const height = editorSize[1];
  const noteMidi =
    pos === 0
      ? base - 12
      : base -
        1 -
        12 +
        Math.ceil(((height - pos) / height) * (availableNotes + 1));

  const freq = c4major(noteMidi);
  if (freq === null) {
    throw new Error(`could not determine note frequency! ${noteMidi}`);
  }
  return freq;
}

export function posToChordNotes(pos: number) {
  const { editorSize } = useAppStore.getState();
  const height = editorSize[1];
  return Math.max(Math.floor((pos / height) * availableNotes), 1);
}
