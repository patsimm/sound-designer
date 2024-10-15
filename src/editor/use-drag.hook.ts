import { useCallback, useEffect } from "react";

type UseDragMoveDetail = {
  target: EventTarget;
  x: number;
  y: number;
  pointerX: number;
  pointerY: number;
};
export type UseDragMoveCallback = (movement: UseDragMoveDetail) => boolean;

let lastEvent: PointerEvent | null = null;
let draggedElement: EventTarget | null = null;
let preventDefaultMouseUp = false;

const handlePointerDown = (ev: PointerEvent) => {
  lastEvent = ev;
  draggedElement = ev.target;
};

const handlePointerUp = (ev: PointerEvent) => {
  lastEvent = null;
  draggedElement = null;
  if (preventDefaultMouseUp) {
    ev.preventDefault();
    ev.stopImmediatePropagation();
    preventDefaultMouseUp = false;
  }
};

const handlePointerMove = (ev: PointerEvent) => {
  if (lastEvent?.pointerId !== ev.pointerId || draggedElement === null) {
    draggedElement = null;
    return;
  }

  const customEvent = new CustomEvent<UseDragMoveDetail>("usedragmove", {
    detail: {
      target: draggedElement,
      x: ev.clientX - lastEvent.clientX,
      y: ev.clientY - lastEvent.clientY,
      pointerX: ev.clientX,
      pointerY: ev.clientY,
    },
    cancelable: true,
  });
  if (!document.dispatchEvent(customEvent)) {
    ev.preventDefault();
    ev.stopPropagation();
    preventDefaultMouseUp = true;
  }
  lastEvent = ev;
};

document.addEventListener("pointerdown", handlePointerDown);
document.addEventListener("pointerup", handlePointerUp, { capture: true });
document.addEventListener("pointermove", handlePointerMove);

export function useDrag({ onDragMove }: { onDragMove: UseDragMoveCallback }) {
  const handleDragMove = useCallback(
    (ev: Event) => {
      if (!(ev instanceof CustomEvent)) return;
      if (!onDragMove(ev.detail)) return;
      ev.preventDefault();
    },
    [onDragMove],
  );
  useEffect(() => {
    document.addEventListener("usedragmove", handleDragMove);
    return () => document.removeEventListener("usedragmove", handleDragMove);
  }, [handleDragMove, onDragMove]);
}
