import { useCallback, useEffect } from "react";

type UseDragMoveDetail = {
  target: EventTarget;
  x: number;
  y: number;
  pointerX: number;
  pointerY: number;
};
export type UseDragMoveCallback = (movement: UseDragMoveDetail) => void;

let lastEvent: PointerEvent | null = null;
let draggedElement: EventTarget | null = null;

const handlePointerDown = (ev: PointerEvent) => {
  lastEvent = ev;
  draggedElement = ev.target;
};

const handlePointerUp = () => {
  lastEvent = null;
  draggedElement = null;
};

const handlePointerMove = (ev: PointerEvent) => {
  if (lastEvent?.pointerId !== ev.pointerId || draggedElement === null) {
    draggedElement = null;
    return;
  }
  ev.preventDefault();
  document.dispatchEvent(
    new CustomEvent<UseDragMoveDetail>("usedragmove", {
      detail: {
        target: draggedElement,
        x: ev.clientX - lastEvent.clientX,
        y: ev.clientY - lastEvent.clientY,
        pointerX: ev.clientX,
        pointerY: ev.clientY,
      },
    }),
  );
  lastEvent = ev;
};

document.addEventListener("pointerdown", handlePointerDown);
document.addEventListener("pointerup", handlePointerUp);
document.addEventListener("pointermove", handlePointerMove);

export function useDrag({ onDragMove }: { onDragMove: UseDragMoveCallback }) {
  const handleDragMove = useCallback(
    (ev: Event) => {
      if (!(ev instanceof CustomEvent)) return;
      onDragMove(ev.detail);
    },
    [onDragMove],
  );
  useEffect(() => {
    document.addEventListener("usedragmove", handleDragMove);
    return () => document.removeEventListener("usedragmove", handleDragMove);
  }, [handleDragMove, onDragMove]);
}
