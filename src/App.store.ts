import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

type Rect = { x: number; y: number; width: number; height: number };

export type Node = Rect;

export type State = {
  size: readonly [number, number];
  nodes: {
    [id: string]: Node;
  };
  indicatorPos: number;
  selectedNodeId: string | null;
};

type Actions = {
  move: (nodeId: string, movementX: number, movementY: number) => void;
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
    size: [400, 400] as const,
    nodes: {
      "1": { x: 0, y: 200, width: 20, height: 20 },
      "2": { x: 100, y: 100, width: 20, height: 20 },
      "3": { x: 200, y: 200, width: 20, height: 20 },
      "4": { x: 300, y: 300, width: 20, height: 20 },
    },
    indicatorPos: 0,
    selectedNodeId: null,
    move: (nodeId: string, movementX: number, movementY: number) =>
      set((state: State) => {
        state.nodes[nodeId].x += movementX;
        state.nodes[nodeId].y += movementY;
      }),
    setSize: (width: number, height: number) =>
      set((state: State) => {
        const scaleX = prepareScale(0, state.size[0], 0, width);
        const scaleY = prepareScale(0, state.size[1], 0, height);
        for (const key in state.nodes) {
          state.nodes[key] = {
            x: scaleX(state.nodes[key].x),
            y: scaleY(state.nodes[key].y),
            width: scaleX(state.nodes[key].width),
            height: scaleY(state.nodes[key].height),
          };
        }
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
