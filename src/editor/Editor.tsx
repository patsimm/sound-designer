import "./Editor.scss";
import { PointerEventHandler, useRef } from "react";
import { Rect } from "./Rect.tsx";
import { useAppStore } from "../App.store.ts";
import useResizeObserver from "@react-hook/resize-observer";
import { TOOL_ADD_NODE, TOOL_MOVE } from "./tools/tools.ts";
import MoveTool from "./tools/MoveTool.tsx";
import AddNodeTool from "./tools/AddNodeTool.tsx";
import { DragContextProvider } from "./DragContextProvider.tsx";

function Editor() {
  const setCanvasSize = useAppStore((state) => state.setCanvasSize);
  const setSelectedNodeId = useAppStore((state) => state.setSelectedNodeId);
  const nodes = useAppStore((state) => state.nodes);
  const toolType = useAppStore((state) => state.tool);
  const selectedNodeId = useAppStore((state) => state.selectedNodeId);
  const setTool = useAppStore((state) => state.setTool);

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
    setCanvasSize(el.clientWidth, el.clientHeight);
  });

  const handleNodeAdded = (nodeId: string) => {
    setTool(TOOL_MOVE);
    setSelectedNodeId(nodeId);
  };

  return (
    <div className={"editor"} data-tool={toolType} ref={ref}>
      <DragContextProvider target={ref}>
        <svg className={"editor__content"} onPointerUp={handlePointerUp}>
          {Object.entries(nodes).map(([id, config]) => (
            <Rect key={id} selected={selectedNodeId === id} {...config} />
          ))}
          {toolType === TOOL_MOVE && <MoveTool />}
          {toolType === TOOL_ADD_NODE && (
            <AddNodeTool onAdded={handleNodeAdded} />
          )}
        </svg>
      </DragContextProvider>
    </div>
  );
}

export default Editor;
