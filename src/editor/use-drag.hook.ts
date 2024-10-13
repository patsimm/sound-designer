import { PointerEvent, PointerEventHandler, useRef } from "react";

export type DragMoveCallback = (movement: {
  target: EventTarget;
  x: number;
  y: number;
}) => void;

export function useDrag({ onDragMove }: { onDragMove: DragMoveCallback }) {
  const lastEvent = useRef<PointerEvent>();
  const draggedElementRef = useRef<EventTarget>();

  const handlePointerDown: PointerEventHandler = (ev) => {
    lastEvent.current = ev;
    draggedElementRef.current = ev.target;
  };

  const handlePointerUp: PointerEventHandler = () => {
    lastEvent.current = undefined;
    draggedElementRef.current = undefined;
  };

  const handlePointerMove: PointerEventHandler = (ev) => {
    if (
      lastEvent.current?.pointerId !== ev.pointerId ||
      !draggedElementRef.current
    )
      return;
    ev.preventDefault();
    onDragMove({
      target: draggedElementRef.current,
      x: -(lastEvent.current.screenX - ev.screenX),
      y: -(lastEvent.current.screenY - ev.screenY),
    });
    lastEvent.current = ev;
  };

  return {
    handlePointerUp,
    handlePointerDown,
    handlePointerMove,
  };
}
