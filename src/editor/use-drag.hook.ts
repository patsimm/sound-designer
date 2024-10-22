import { useCallback, useEffect } from "react";

type UseDragMoveDetail = {
  target: EventTarget;
  x: number;
  y: number;
  pointerX: number;
  pointerY: number;
};
export type UseDragMoveCallback = (movement: UseDragMoveDetail) => boolean;
export type UseDragEndCallback = () => void;

let lastEvent: PointerEvent | null = null;
let draggedElement: EventTarget | null = null;
let preventDefaultMouseUp = false;

const handlePointerDown = (ev: PointerEvent) => {
  lastEvent = ev;
  draggedElement = ev.target;
};

const handlePointerUp = (ev: PointerEvent) => {
  if (draggedElement != null) {
    const customEvent = new CustomEvent<UseDragMoveDetail>("usedragend");
    document.dispatchEvent(customEvent);
  }
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

export function useDrag({
  onDragMove,
  onDragEnd,
}: {
  onDragMove: UseDragMoveCallback;
  onDragEnd?: UseDragEndCallback;
}) {
  const handleDragMove = useCallback(
    (ev: Event) => {
      if (!(ev instanceof CustomEvent)) return;
      if (!onDragMove(ev.detail)) return;
      ev.preventDefault();
    },
    [onDragMove],
  );

  const handleDragEnd = useCallback(
    (ev: Event) => {
      if (!(ev instanceof CustomEvent)) return;
      onDragEnd?.();
    },
    [onDragEnd],
  );
  useEffect(() => {
    document.addEventListener("usedragmove", handleDragMove);
    document.addEventListener("usedragend", handleDragEnd);
    return () => {
      document.removeEventListener("usedragmove", handleDragMove);
      document.removeEventListener("usedragend", handleDragEnd);
    };
  }, [handleDragEnd, handleDragMove, onDragMove]);
}
