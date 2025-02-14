import * as Scale from "@tonaljs/scale";

import { selectGrid, selectGridSize, useAppStore } from "../App.store.ts";

const c4major = Scale.steps("C4 mixolydian");

export function posToNote(pos: number) {
  const state = useAppStore.getState();
  const gridSize = selectGridSize(state);
  const grid = selectGrid(state);
  const noteMidi = gridSize[1] / 2 - Math.ceil((pos - grid[1] / 2) / grid[1]);

  const freq = c4major(noteMidi);
  if (freq === null) {
    throw new Error(`could not determine note frequency! ${noteMidi}`);
  }
  return freq;
}

export function posToChordNotes(pos: number) {
  const state = useAppStore.getState();
  const grid = selectGrid(state);
  return Math.max(Math.floor(pos / grid[1]), 1);
}
