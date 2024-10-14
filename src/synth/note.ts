import * as Note from "@tonaljs/note";
import { useAppStore } from "../App.store.ts";

const availableNotes = 24;
const base = 60;

export function posToFreq(pos: number) {
  const { size } = useAppStore.getState();
  const height = size[1];
  const noteMidi =
    pos === 0
      ? base - 12
      : base -
        1 -
        12 +
        Math.ceil(((height - pos) / height) * (availableNotes + 1));

  const freq = Note.freq(Note.fromMidi(noteMidi));
  if (freq === null) {
    throw new Error("could not determine note frequency!");
  }
  return freq;
}
