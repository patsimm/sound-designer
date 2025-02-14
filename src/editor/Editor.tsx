import "./Editor.scss";
import { PointerEventHandler, useRef } from "react";
import { Rect } from "./nodes/Rect.tsx";
import { selectGrid, selectGridSize, useAppStore } from "../App.store.ts";
import useResizeObserver from "@react-hook/resize-observer";
import { TOOL_ADD_NODE, TOOL_MOVE } from "./tools/tools.ts";
import MoveTool from "./tools/MoveTool.tsx";
import AddNodeTool from "./tools/AddNodeTool.tsx";
import { DragContextProvider } from "./DragContextProvider.tsx";
import { useShallow } from "zustand/react/shallow";
import classNames from "classnames";
import Indicator from "./components/Indicator";

function Editor() {
  const setEditorSize = useAppStore((state) => state.setEditorSize);
  const setSelectedNodeId = useAppStore((state) => state.setSelectedNodeId);
  const nodes = useAppStore((state) => state.nodes);
  const toolType = useAppStore((state) => state.tool);
  const selectedNodeId = useAppStore((state) => state.selectedNodeId);
  const setTool = useAppStore((state) => state.setTool);
  const move = useAppStore((state) => state.move);
  const grid = useAppStore(useShallow(selectGrid));

  const handlePointerUp: PointerEventHandler<SVGSVGElement> = (ev) => {
    if (!(ev.target instanceof SVGElement)) {
      setSelectedNodeId(null);
      return;
    }
    const clickedNodeId = ev.target.getAttribute("data-id");
    setSelectedNodeId(clickedNodeId);
  };

  const ref = useRef<HTMLDivElement>(null);
  useResizeObserver(ref, () => {
    const el = ref.current;
    if (!el) return;
    setEditorSize(el.clientWidth, el.clientHeight);
  });

  const handleNodeAdded = (nodeId: string) => {
    setTool(TOOL_MOVE);
    setSelectedNodeId(nodeId);
  };

  return (
    <div className={"editor"} data-tool={toolType} ref={ref}>
      <Indicator />
      <DragContextProvider target={ref}>
        <svg className={"editor__content"} onPointerUp={handlePointerUp}>
          <EditorGrid />
          {Object.entries(nodes).map(([id, config]) => (
            <Rect
              key={id}
              selected={selectedNodeId === id}
              grid={grid}
              {...config}
              onDragMove={({ x, y }) => {
                if (toolType === TOOL_MOVE) {
                  setSelectedNodeId(id);
                  move(id, x, y);
                  return true;
                }
                return false;
              }}
            />
          ))}
          {toolType === TOOL_MOVE && <MoveTool />}
          {toolType === TOOL_ADD_NODE && (
            <AddNodeTool editorRef={ref} onAdded={handleNodeAdded} />
          )}
        </svg>
      </DragContextProvider>
    </div>
  );
}

function EditorGrid() {
  const editorSize = useAppStore((store) => store.editorSize);
  const gridSize = useAppStore(useShallow(selectGridSize));
  const data = [...Array(gridSize[0])]
    .map((_, ix) => [...Array(gridSize[1])].map((_, iy) => [ix, iy] as const))
    .flat();
  return (
    <g className={classNames("editor__grid")}>
      {data.map((pos) => (
        <circle
          key={`${pos[0]},${pos[1]}`}
          data-highlight={pos[0] % 8 === 0}
          cx={(pos[0] / gridSize[0]) * editorSize[0]}
          cy={(pos[1] / gridSize[1]) * editorSize[1]}
          r="3"
        />
      ))}
    </g>
  );
}

export default Editor;
