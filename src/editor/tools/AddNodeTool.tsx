import { RefObject, useCallback, useMemo, useState } from "react";
import { selectGrid, useAppStore } from "../../App.store.ts";
import { ENTITY_NODE_SKELETON } from "../entities.ts";
import classNames from "classnames";
import {
  useDrag,
  UseDragEndCallback,
  UseDragMoveCallback,
} from "../drag.hook.tsx";
import { usePointerPos } from "../pointer.hook.tsx";
import { useShallow } from "zustand/react/shallow";

type AddNodeToolProps = {
  onAdded: (nodeId: string) => void;
  editorRef: RefObject<HTMLElement>;
};

function AddNodeTool({ onAdded, editorRef }: AddNodeToolProps) {
  const [anchor, setAnchor] = useState<[number, number] | null>(null);
  const pointerPos = usePointerPos();
  const addRect = useAppStore((state) => state.addRect);
  const grid = useAppStore(useShallow(selectGrid));

  const [pointerRectX, pointerRectY] = useMemo(
    () => [
      pointerPos && Math.trunc(pointerPos[0] / grid[0]) * grid[0],
      pointerPos && Math.trunc(pointerPos[1] / grid[1]) * grid[1],
    ],
    [grid, pointerPos],
  );

  const [anchorRectX, anchorRectY] = useMemo(
    () => [
      anchor && Math.trunc(anchor[0] / grid[0]) * grid[0],
      anchor && Math.trunc(anchor[1] / grid[1]) * grid[1],
    ],
    [anchor, grid],
  );

  const [growthX, growthY] = useMemo(() => {
    if (anchor === null || pointerPos === null) return [null, null];
    return [
      Math.trunc((anchor[0] - pointerPos[0]) / grid[0]) * grid[0],
      Math.trunc((anchor[1] - pointerPos[1]) / grid[1]) * grid[1],
    ];
  }, [anchor, grid, pointerPos]);

  const rect = useMemo(() => {
    if (
      anchorRectX === null ||
      anchorRectY === null ||
      pointerRectX === null ||
      pointerRectY === null ||
      anchor === null ||
      growthX === null ||
      growthY === null
    )
      return null;

    const width = Math.abs(growthX) + grid[0];
    const height = Math.abs(growthY) + grid[1];

    return {
      x: growthX < 0 ? anchorRectX : anchorRectX - growthX,
      y: growthY < 0 ? anchorRectY : anchorRectY - growthY,
      width,
      height,
    };
  }, [
    anchor,
    anchorRectX,
    anchorRectY,
    grid,
    growthX,
    growthY,
    pointerRectX,
    pointerRectY,
  ]);

  const handleDragMove: UseDragMoveCallback = useCallback(
    ({ x, y, pointerX, pointerY }) => {
      setAnchor((anchor) =>
        anchor === null ? [pointerX - x, pointerY - y] : anchor,
      );
    },
    [],
  );

  const handleDragEnd: UseDragEndCallback = useCallback(() => {
    if (rect == null) return;
    const added = addRect(rect.x, rect.y, rect.width, rect.height);
    setAnchor(null);
    if (added === undefined) return;
    onAdded(added);
  }, [addRect, onAdded, rect]);

  useDrag({
    onDragMove: handleDragMove,
    onDragEnd: handleDragEnd,
    setNodeRef: editorRef,
  });
  return (
    <>
      {rect ? (
        <rect
          className={classNames("editor__node-skeleton")}
          data-type={ENTITY_NODE_SKELETON}
          x={rect.x}
          y={rect.y}
          width={rect.width}
          height={rect.height}
        />
      ) : pointerRectX !== null && pointerRectY !== null ? (
        <rect
          className={classNames("editor__node-skeleton")}
          x={pointerRectX}
          y={pointerRectY}
          width={grid[0]}
          height={grid[1]}
        />
      ) : (
        <></>
      )}
    </>
  );
}

export default AddNodeTool;
