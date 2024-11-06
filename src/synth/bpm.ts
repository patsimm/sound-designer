import { useAppStore } from "../App.store.ts";

export function calcLoopLength(bpm: number, measures: number = 4) {
  return 1 / (bpm / 60 / measures);
}

export function posToTime(pos: number) {
  const { editorSize, bpm } = useAppStore.getState();
  const width = editorSize[0];
  const loopLength = calcLoopLength(bpm);
  return (pos / width) * loopLength;
}

export function timeToPos(time: number) {
  const { editorSize, bpm } = useAppStore.getState();
  const width = editorSize[0];
  const loopLength = calcLoopLength(bpm);
  return ((time % loopLength) / loopLength) * width;
}

export function beatStart(time: number) {
  const { bpm } = useAppStore.getState();
  const loopLength = calcLoopLength(bpm);
  return Math.floor(time / loopLength) * loopLength;
}

export function beatEnd(time: number) {
  const { bpm } = useAppStore.getState();
  const loopLength = calcLoopLength(bpm);
  return Math.floor(time / loopLength + 1) * loopLength;
}
