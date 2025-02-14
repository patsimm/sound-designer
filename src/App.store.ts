import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { EditorNode } from "./editor/entities.ts";
import { TOOL_MOVE, ToolType } from "./editor/tools/tools.ts";
import { v7 as uuid } from "uuid";

export type EditorNodesState = Record<string, EditorNode>;

export type State = {
  bpm: number;
  editorSize: readonly [number, number];
  gridSize: readonly [number, number];
  nodes: EditorNodesState;
  indicatorPos: number;
  selectedNodeId: string | null;
  tool: ToolType;
};

type Actions = {
  move: (nodeId: string, movementX: number, movementY: number) => void;
  resize: (nodeId: string, x: number, y: number) => void;
  changeColor: (nodeId: string, color: string) => void;
  setEditorSize: (width: number, height: number) => void;
  setIndicatorPos: (pos: number) => void;
  setSelectedNodeId: (nodeId: string | null) => void;
  setTool: (tool: ToolType) => void;
  addRect: (
    x: number,
    y: number,
    width: number,
    height: number,
    color: string,
  ) => string | undefined;
  removeNode: (nodeId: string) => void;
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
    editorSize: [32, 24] as const,
    gridSize: [32, 24] as const,
    nodes: {
      "1": {
        id: "1",
        x: 0,
        y: 12,
        width: 4,
        height: 1,
        color: "var(--color-secondary-100)",
      },
      "2": { id: "2", x: 8, y: 6, width: 4, height: 1, color: "#275DF1" },
      "3": { id: "3", x: 16, y: 10, width: 4, height: 3, color: "#275DF1" },
      "4": { id: "4", x: 24, y: 18, width: 4, height: 1, color: "#275DF1" },
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
    changeColor: (nodeId: string, color: string) =>
      set((state: State) => {
        state.nodes[nodeId].color = color;
      }),
    setEditorSize: (width: number, height: number) =>
      set((state: State) => {
        const scaleX = prepareScale(0, state.editorSize[0], 0, width);
        const scaleY = prepareScale(0, state.editorSize[1], 0, height);
        for (const id in state.nodes) {
          state.nodes[id] = {
            ...state.nodes[id],
            x: scaleX(state.nodes[id].x),
            y: scaleY(state.nodes[id].y),
            width: scaleX(state.nodes[id].width),
            height: scaleY(state.nodes[id].height),
          };
        }
        state.indicatorPos = scaleX(state.indicatorPos);
        state.editorSize = [width, height];
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
    addRect: (
      x: number,
      y: number,
      width: number,
      height: number,
      color: string,
    ) => {
      let newId: string | undefined;
      set((state: State) => {
        if (
          width < state.editorSize[0] / state.gridSize[0] ||
          height < state.editorSize[1] / state.gridSize[1]
        ) {
          return;
        }
        newId = uuid();
        state.nodes = {
          ...state.nodes,
          [newId]: { id: newId, x, y, width, height, color },
        };
      });
      return newId;
    },
    removeNode: (nodeId: string) =>
      set((state: State) => {
        delete state.nodes[nodeId];
      }),
  })),
);

export const selectGridSize = (state: State) => state.gridSize;
export const selectGrid = (state: State) => {
  const gridSize = selectGridSize(state);
  return [
    state.editorSize[0] / gridSize[0],
    state.editorSize[1] / gridSize[1],
  ] as const;
};
