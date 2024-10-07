import "./Editor.scss";
import { MouseEventHandler, useRef, useState } from "react";
import { Rect } from "./Rect.tsx";
import { useAppStore } from "../App.store.ts";
import useResizeObserver from "@react-hook/resize-observer";

function Editor() {
  const move = useAppStore((state) => state.move);
  const setSize = useAppStore((state) => state.setSize);
  const nodes = useAppStore((state) => state.nodes);
  const [draggedElement, setDraggedElement] = useState<SVGElement | null>(null);

  const handleMouseDown: MouseEventHandler<SVGSVGElement> = (ev) => {
    if (ev.target instanceof SVGElement) setDraggedElement(ev.target);
    setSelectedNodeId(null);
  };

  const handleMouseUp: MouseEventHandler<SVGSVGElement> = () => {
    setDraggedElement(null);
  };

  const handleMouseMove: MouseEventHandler<SVGSVGElement> = (ev) => {
    const draggedNodeId = draggedElement?.getAttribute("data-id");
    if (typeof draggedNodeId != "string") {
      return;
    }
    ev.preventDefault();
    move(draggedNodeId, ev.movementX, ev.movementY);
  };

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const handleClick: MouseEventHandler<SVGSVGElement> = (ev) => {
    if (!(ev.target instanceof SVGElement)) return;
    console.log(ev.target);
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
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onClick={handleClick}
      >
        {Object.entries(nodes).map(([id, config]) => (
          <Rect key={id} id={id} selected={selectedNodeId === id} {...config} />
        ))}
      </svg>
    </div>
  );
}

export default Editor;
