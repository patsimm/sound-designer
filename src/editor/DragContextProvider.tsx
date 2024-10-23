import {
  PropsWithChildren,
  RefObject,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { UseDragMoveDetail } from "./drag.hook.tsx";
import { dragContext } from "./drag.context.tsx";

export type DragContextProviderProps = {
  target: RefObject<HTMLDivElement>;
};

export function DragContextProvider({
  children,
  target,
}: PropsWithChildren<DragContextProviderProps>) {
  const lastEventRef = useRef<PointerEvent | null>(null);
  const draggedElementRef = useRef<EventTarget | null>(null);
  const preventDefaultMouseUpRef = useRef<boolean>(false);

  const handlePointerDown = (ev: PointerEvent) => {
    lastEventRef.current = ev;
    draggedElementRef.current = ev.target;
  };

  const handlePointerUp = useCallback(
    (ev: PointerEvent) => {
      if (draggedElementRef.current != null) {
        const customEvent = new CustomEvent<UseDragMoveDetail>("usedragend");
        target.current?.dispatchEvent(customEvent);
      }
      lastEventRef.current = null;
      draggedElementRef.current = null;
      if (preventDefaultMouseUpRef.current) {
        ev.preventDefault();
        ev.stopImmediatePropagation();
        preventDefaultMouseUpRef.current = false;
      }
    },
    [target],
  );

  const handlePointerMove = useCallback(
    (ev: PointerEvent) => {
      if (
        lastEventRef.current?.pointerId !== ev.pointerId ||
        draggedElementRef.current === null
      ) {
        draggedElementRef.current = null;
        return;
      }

      const customEvent = new CustomEvent<UseDragMoveDetail>("usedragmove", {
        detail: {
          target: draggedElementRef.current,
          x: ev.clientX - lastEventRef.current.clientX,
          y: ev.clientY - lastEventRef.current.clientY,
          pointerX: ev.clientX,
          pointerY: ev.clientY,
        },
        cancelable: true,
      });
      if (!target.current?.dispatchEvent(customEvent)) {
        ev.preventDefault();
        ev.stopPropagation();
        preventDefaultMouseUpRef.current = true;
      }
      lastEventRef.current = ev;
    },
    [target],
  );

  useEffect(() => {
    const targetElement = target.current;
    if (!targetElement) return;
    targetElement.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("pointerup", handlePointerUp, {
      capture: true,
    });
    document.addEventListener("pointermove", handlePointerMove);
    return () => {
      targetElement.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("pointerup", handlePointerUp, {
        capture: true,
      });
      document.removeEventListener("pointermove", handlePointerMove);
    };
  }, [handlePointerMove, handlePointerUp, target]);

  return (
    <dragContext.Provider value={{ target: target }}>
      {children}
    </dragContext.Provider>
  );
}
