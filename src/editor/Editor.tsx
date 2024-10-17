import "./Editor.scss";
import { PointerEventHandler, useRef } from "react";
import { Rect } from "./Rect.tsx";
import { useAppStore } from "../App.store.ts";
import useResizeObserver from "@react-hook/resize-observer";
import NodeSelection, {
  SelectionAnchorMoveEventHandler,
} from "./NodeSelection.tsx";
import { UseDragMoveCallback, useDrag } from "./use-drag.hook.ts";
import { horizontalSign, verticalSign } from "./anchor-direction.ts";

function Editor() {
  const move = useAppStore((state) => state.move);
  const resize = useAppStore((state) => state.resize);
  const setSize = useAppStore((state) => state.setSize);
  const nodes = useAppStore((state) => state.nodes);
  const minSizeRect = useAppStore((state) => state.minSizeRect);

  const handleDragMove: UseDragMoveCallback = ({ target, x, y }) => {
    if (!(target instanceof SVGElement)) return false;
    const draggedNodeId = target.getAttribute("data-id");
    if (draggedNodeId == null) return false;

    move(draggedNodeId, x, y);
    setSelectedNodeId(draggedNodeId);
    return true;
  };

  useDrag({
    onDragMove: handleDragMove,
  });

  const selectedNode = useAppStore((state) =>
    state.selectedNodeId !== null ? state.nodes[state.selectedNodeId] : null,
  );
  const setSelectedNodeId = useAppStore((state) => state.setSelectedNodeId);

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
    setSize(el.clientWidth, el.clientHeight);
  });

  const handleSelectionAnchorMove: SelectionAnchorMoveEventHandler = (
    dir,
    x,
    y,
  ) => {
    if (!selectedNode) return;
    const xSign = horizontalSign(dir);
    const ySign = verticalSign(dir);

    const resizeX =
      selectedNode.width + x * xSign < minSizeRect[0]
        ? (selectedNode.width - minSizeRect[0]) * -xSign
        : x;
    const resizeY =
      selectedNode.height + y * ySign < minSizeRect[1]
        ? (selectedNode.height - minSizeRect[1]) * -ySign
        : y;

    resize(selectedNode.id, resizeX * xSign, resizeY * ySign);
    move(selectedNode.id, xSign > 0 ? 0 : resizeX, ySign > 0 ? 0 : resizeY);
  };

  return (
    <div className={"editor"} ref={ref}>
      <svg className={"editor__content"} onPointerUp={handlePointerUp}>
        {Object.entries(nodes).map(([id, config]) => (
          <Rect key={id} selected={selectedNode?.id === id} {...config} />
        ))}
        {selectedNode && (
          <NodeSelection
            node={selectedNode}
            onSelectionAnchorMove={handleSelectionAnchorMove}
          />
        )}
      </svg>
    </div>
  );
}

export default Editor;
