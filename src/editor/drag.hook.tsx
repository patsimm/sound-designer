import { RefObject, useCallback, useContext, useEffect, useRef } from "react";
import { dragContext } from "./drag.context.tsx";

export type UseDragMoveDetail = {
  target: EventTarget | null;
  x: number;
  y: number;
  pointerX: number;
  pointerY: number;
};
export type UseDragMoveCallback = (movement: UseDragMoveDetail) => void;
export type UseDragStartCallback = (movement: UseDragMoveDetail) => void;
export type UseDragEndCallback = () => void;

export type UseDragMiddleware = (
  pos: [number, number],
  movement: [number, number],
) => [number, number];

export type UseDragProps = {
  setNodeRef: RefObject<Element & GlobalEventHandlers>;
  onDragMove: UseDragMoveCallback;
  onDragStart?: UseDragStartCallback;
  onDragEnd?: UseDragEndCallback;
  middleware?: UseDragMiddleware;
};

export function useDrag({
  onDragMove,
  onDragStart,
  onDragEnd,
  setNodeRef,
  middleware,
}: UseDragProps) {
  const { initDrag } = useContext(dragContext);

  const onDragStartRef = useRef(onDragStart);
  useEffect(() => {
    onDragStartRef.current = onDragStart;
  }, [onDragStart]);

  const onDragMoveRef = useRef(onDragMove);
  useEffect(() => {
    onDragMoveRef.current = onDragMove;
  }, [onDragMove]);

  const onDragEndRef = useRef(onDragEnd);
  useEffect(() => {
    onDragEndRef.current = onDragEnd;
  }, [onDragEnd]);

  const middlewareRef = useRef(middleware);
  useEffect(() => {
    middlewareRef.current = middleware;
  }, [middleware]);

  const applyMiddleware = useRef((detail: UseDragMoveDetail) => {
    if (!middlewareRef.current) return detail;
    const [newX, newY] = middlewareRef.current(
      [detail.pointerX, detail.pointerY],
      [detail.x, detail.y],
    );
    const newDetail: UseDragMoveDetail = {
      pointerX: newX,
      pointerY: newY,
      target: detail.target,
      x: newX - (detail.pointerX - detail.x),
      y: newY - (detail.pointerY - detail.y),
    };
    return newDetail;
  });

  const handlePointerDown = useCallback(
    (ev: PointerEvent) => {
      ev.preventDefault();
      ev.stopImmediatePropagation();
      const nodeRef = setNodeRef.current;
      if (!nodeRef) return;
      initDrag(
        ev,
        nodeRef,
        (detail) => onDragMoveRef.current(applyMiddleware.current(detail)),
        (detail) => onDragStartRef.current?.(detail),
        () => onDragEndRef.current?.(),
      );
    },
    [initDrag, setNodeRef],
  );

  useEffect(() => {
    const nodeRef = setNodeRef.current;
    if (!nodeRef) return;
    nodeRef.addEventListener("pointerdown", handlePointerDown);
    return () => {
      nodeRef.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [handlePointerDown, setNodeRef]);
}
