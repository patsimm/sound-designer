import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

type Rect = { id: string; x: number; y: number; width: number; height: number };

export type Node = Rect;

export type State = {
  bpm: number;
  size: readonly [number, number];
  minSizeRect: readonly [number, number];
  nodes: {
    [id: string]: Node;
  };
  indicatorPos: number;
  selectedNodeId: string | null;
};

type Actions = {
  move: (nodeId: string, movementX: number, movementY: number) => void;
  resize: (nodeId: string, x: number, y: number) => void;
  setSize: (width: number, height: number) => void;
  setIndicatorPos: (pos: number) => void;
  setSelectedNodeId: (nodeId: string | null) => void;
};

function lerp(v0: number, v1: number, t: number) {
  return (1 - t) * v0 + t * v1;
}

const prepareScale =
  (minBefore: number, maxBefore: number, minAfter: number, maxAfter: number) =>
  (value: number) => {
    const val = (value - minBefore) / (maxBefore - minBefore);
    return lerp(minAfter, maxAfter, val);
  };

export const useAppStore = create<State & Actions>()(
  immer((set) => ({
    bpm: 160,
    size: [400, 400],
    minSizeRect: [10, 10],
    nodes: {
      "1": { id: "1", x: 0, y: 200, width: 60, height: 20 },
      "2": { id: "2", x: 100, y: 100, width: 60, height: 20 },
      "3": { id: "3", x: 200, y: 160, width: 60, height: 60 },
      "4": { id: "4", x: 300, y: 300, width: 60, height: 20 },
    },
    indicatorPos: 0,
    selectedNodeId: null,
    move: (nodeId: string, movementX: number, movementY: number) =>
      set((state: State) => {
        state.nodes[nodeId].x += movementX;
        state.nodes[nodeId].y += movementY;
      }),
    resize: (nodeId: string, x: number, y: number) =>
      set((state: State) => {
        state.nodes[nodeId].width += x;
        state.nodes[nodeId].height += y;
      }),
    setSize: (width: number, height: number) =>
      set((state: State) => {
        const scaleX = prepareScale(0, state.size[0], 0, width);
        const scaleY = prepareScale(0, state.size[1], 0, height);
        for (const id in state.nodes) {
          state.nodes[id] = {
            id,
            x: scaleX(state.nodes[id].x),
            y: scaleY(state.nodes[id].y),
            width: scaleX(state.nodes[id].width),
            height: scaleY(state.nodes[id].height),
          };
        }
        state.minSizeRect = [
          scaleX(state.minSizeRect[0]),
          scaleY(state.minSizeRect[1]),
        ];
        state.indicatorPos = scaleX(state.indicatorPos);
        state.size = [width, height];
      }),
    setIndicatorPos: (indicatorPos: number) =>
      set((state: State) => {
        state.indicatorPos = indicatorPos;
      }),
    setSelectedNodeId: (nodeId: string | null) =>
      set((state: State) => {
        state.selectedNodeId = nodeId;
      }),
  })),
);
