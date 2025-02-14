import {
  PropsWithChildren,
  RefObject,
  useCallback,
  useEffect,
  useRef,
} from "react";

import { dragContext } from "./drag.context.tsx";
import {
  UseDragEndCallback,
  UseDragMoveCallback,
  UseDragMoveDetail,
  UseDragStartCallback,
} from "./drag.hook.tsx";

export type DragContextProviderProps = {
  target: RefObject<HTMLDivElement>;
};

export function DragContextProvider({
  children,
}: PropsWithChildren<DragContextProviderProps>) {
  const lastEventRef = useRef<PointerEvent | null>(null);
  const draggedElementRef = useRef<(Element & GlobalEventHandlers) | null>(
    null,
  );
  const useDragMoveCbRef = useRef<UseDragMoveCallback | null>(null);
  const useDragEndCbRef = useRef<UseDragEndCallback | null>(null);
  const useDragStartCbRef = useRef<UseDragStartCallback | null>(null);

  const movingRef = useRef(false);

  const handlePointerUp = useRef((ev: PointerEvent) => {
    if (movingRef.current) {
      ev.preventDefault();
      ev.stopImmediatePropagation();
      useDragEndCbRef.current?.();
    }

    document.removeEventListener("pointermove", handlePointerMove.current);
    lastEventRef.current = null;
    draggedElementRef.current = null;
    useDragEndCbRef.current = null;
    useDragMoveCbRef.current = null;
    useDragStartCbRef.current = null;
    movingRef.current = false;
  });

  const handlePointerMove = useRef((ev: PointerEvent) => {
    if (
      lastEventRef.current?.pointerId !== ev.pointerId ||
      draggedElementRef.current === null
    ) {
      draggedElementRef.current = null;
      return;
    }

    const detail: UseDragMoveDetail = {
      target: draggedElementRef.current,
      x: ev.clientX - lastEventRef.current.clientX,
      y: ev.clientY - lastEventRef.current.clientY,
      pointerX: ev.clientX,
      pointerY: ev.clientY,
    };

    if (!movingRef.current) {
      movingRef.current = true;
      useDragStartCbRef.current?.(detail);
    }

    if (!lastEventRef.current) return;
    useDragMoveCbRef.current?.(detail);
    lastEventRef.current = ev;
  });

  const handleInitDrag = useCallback(
    (
      ev: PointerEvent,
      el: (Element & GlobalEventHandlers) | null,
      moveCallback: UseDragMoveCallback,
      startCallback?: UseDragStartCallback,
      endCallback?: UseDragEndCallback,
    ) => {
      lastEventRef.current = ev;
      draggedElementRef.current = el;
      useDragMoveCbRef.current = moveCallback;
      useDragStartCbRef.current = startCallback ?? null;
      useDragEndCbRef.current = endCallback ?? null;
      document.addEventListener("pointermove", handlePointerMove.current);
    },
    [],
  );

  useEffect(() => {
    const onPointerUp = (ev: PointerEvent) => handlePointerUp.current(ev);
    document.addEventListener("pointerup", onPointerUp, {
      capture: true,
    });
    return () => {
      document.removeEventListener("pointerup", onPointerUp, {
        capture: true,
      });
    };
  }, [handlePointerUp]);

  return (
    <dragContext.Provider
      value={{
        initDrag: handleInitDrag,
      }}
    >
      {children}
    </dragContext.Provider>
  );
}
