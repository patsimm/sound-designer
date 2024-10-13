import "./Editor.scss";
import { MouseEventHandler, useRef } from "react";
import { Rect } from "./Rect.tsx";
import { useAppStore } from "../App.store.ts";
import useResizeObserver from "@react-hook/resize-observer";
import ScaleTool from "./ScaleTool.tsx";
import { DragMoveCallback, useDrag } from "./use-drag.hook.ts";

function Editor() {
  const move = useAppStore((state) => state.move);
  const setSize = useAppStore((state) => state.setSize);
  const nodes = useAppStore((state) => state.nodes);

  const handleDragMove: DragMoveCallback = ({ target, x, y }) => {
    if (!(target instanceof SVGElement)) return;
    const draggedNodeId = target.getAttribute("data-id");
    if (draggedNodeId == null) {
      return;
    }
    move(draggedNodeId, x, y);
  };

  const { handlePointerMove, handlePointerDown, handlePointerUp } = useDrag({
    onDragMove: handleDragMove,
  });

  const selectedNodeId = useAppStore((state) => state.selectedNodeId);
  const setSelectedNodeId = useAppStore((state) => state.setSelectedNodeId);

  const handleClick: MouseEventHandler<SVGSVGElement> = (ev) => {
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

  return (
    <div className={"editor"} ref={ref}>
      <svg
        className={"editor__content"}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onClick={handleClick}
      >
        {Object.entries(nodes).map(([id, config]) => (
          <Rect key={id} id={id} selected={selectedNodeId === id} {...config} />
        ))}
        <ScaleTool></ScaleTool>
      </svg>
    </div>
  );
}

export default Editor;
