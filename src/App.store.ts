import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { EditorNode } from "./editor/entities.ts";
import { TOOL_MOVE, ToolType } from "./editor/tools/tools.ts";
import { v7 as uuid } from "uuid";

export type State = {
  bpm: number;
  size: readonly [number, number];
  minSizeNode: readonly [number, number];
  nodes: {
    [id: string]: EditorNode;
  };
  indicatorPos: number;
  selectedNodeId: string | null;
  tool: ToolType;
};

type Actions = {
  move: (nodeId: string, movementX: number, movementY: number) => void;
  resize: (nodeId: string, x: number, y: number) => void;
  setCanvasSize: (width: number, height: number) => void;
  setIndicatorPos: (pos: number) => void;
  setSelectedNodeId: (nodeId: string | null) => void;
  setTool: (tool: ToolType) => void;
  addRect: (
    x: number,
    y: number,
    width: number,
    height: number,
  ) => string | undefined;
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
    minSizeNode: [10, 10],
    nodes: {
      "1": { id: "1", x: 0, y: 200, width: 60, height: 20 },
      "2": { id: "2", x: 100, y: 100, width: 60, height: 20 },
      "3": { id: "3", x: 200, y: 160, width: 60, height: 60 },
      "4": { id: "4", x: 300, y: 300, width: 60, height: 20 },
    },
    indicatorPos: 0,
    selectedNodeId: null,
    tool: TOOL_MOVE,
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
    setCanvasSize: (width: number, height: number) =>
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
        state.minSizeNode = [
          scaleX(state.minSizeNode[0]),
          scaleY(state.minSizeNode[1]),
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
    setTool: (tool: ToolType) =>
      set((state: State) => {
        state.tool = tool;
      }),
    addRect: (x: number, y: number, width: number, height: number) => {
      let newId: string | undefined;
      set((state: State) => {
        if (width < state.minSizeNode[0] || height < state.minSizeNode[1]) {
          return;
        }
        newId = uuid();
        state.nodes = {
          ...state.nodes,
          [newId]: { id: newId, x, y, width, height },
        };
      });
      return newId;
    },
  })),
);
