import { RefObject, useCallback, useMemo, useState } from "react";
import { useAppStore } from "../../App.store.ts";
import { ENTITY_NODE_SKELETON } from "../entities.ts";
import classNames from "classnames";
import {
  useDrag,
  UseDragEndCallback,
  UseDragMoveCallback,
} from "../drag.hook.tsx";

type AddNodeToolProps = {
  onAdded: (nodeId: string) => void;
  editorRef: RefObject<HTMLElement>;
};

function AddNodeTool({ onAdded, editorRef }: AddNodeToolProps) {
  const [anchor, setAnchor] = useState<[number, number] | null>(null);
  const [mouse, setMouse] = useState<[number, number] | null>(null);
  const addRect = useAppStore((state) => state.addRect);

  const rect = useMemo(
    () =>
      anchor &&
      mouse && {
        x: Math.min(anchor[0], mouse[0]),
        y: Math.min(anchor[1], mouse[1]),
        width: Math.abs(anchor[0] - mouse[0]),
        height: Math.abs(anchor[1] - mouse[1]),
      },
    [anchor, mouse],
  );

  const handleDragMove: UseDragMoveCallback = useCallback(
    ({ x, y, pointerX, pointerY }) => {
      console.log("handleDragMove");
      setAnchor((anchor) =>
        anchor === null ? [pointerX - x, pointerY - y] : anchor,
      );
      setMouse((mouse) => {
        if (mouse === null || anchor === null)
          return [pointerX - x, pointerY - y];
        return [mouse[0] + x, mouse[1] + y];
      });
    },
    [anchor],
  );

  const handleDragEnd: UseDragEndCallback = useCallback(() => {
    if (rect == null) return;
    const added = addRect(rect.x, rect.y, rect.width, rect.height);
    setMouse(null);
    setAnchor(null);
    if (added === undefined) return;
    onAdded(added);
  }, [addRect, onAdded, rect]);

  useDrag({
    onDragMove: handleDragMove,
    onDragEnd: handleDragEnd,
    setNodeRef: editorRef,
  });
  return rect ? (
    <rect
      className={classNames("editor__node-skeleton")}
      data-type={ENTITY_NODE_SKELETON}
      x={rect.x}
      y={rect.y}
      width={rect.width}
      height={rect.height}
    />
  ) : (
    <></>
  );
}

export default AddNodeTool;
