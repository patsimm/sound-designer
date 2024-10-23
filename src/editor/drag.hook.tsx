import { useCallback, useContext, useEffect } from "react";
import { dragContext } from "./drag.context.tsx";

export type UseDragMoveDetail = {
  target: EventTarget;
  x: number;
  y: number;
  pointerX: number;
  pointerY: number;
};
export type UseDragMoveCallback = (movement: UseDragMoveDetail) => boolean;
export type UseDragEndCallback = () => void;

export function useDrag({
  onDragMove,
  onDragEnd,
}: {
  onDragMove: UseDragMoveCallback;
  onDragEnd?: UseDragEndCallback;
}) {
  const { target } = useContext(dragContext);

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
    const targetElement = target.current;
    if (!targetElement) return;
    targetElement.addEventListener("usedragmove", handleDragMove);
    targetElement.addEventListener("usedragend", handleDragEnd);
    return () => {
      targetElement.removeEventListener("usedragmove", handleDragMove);
      targetElement.removeEventListener("usedragend", handleDragEnd);
    };
  }, [handleDragEnd, handleDragMove, onDragMove, target]);
}
