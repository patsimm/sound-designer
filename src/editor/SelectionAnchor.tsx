import classNames from "classnames";
import {
  AnchorDirection,
  horizontalSign,
  verticalSign,
} from "./anchor-direction.ts";
import { ENTITY_SELECTION_ANCHOR, entityTypeProps } from "./entities.ts";
import { useDrag, UseDragMoveCallback } from "./drag.hook.tsx";
import { createRef } from "react";

export const SELECTION_ANCHOR_SIZE = 10;

type SelectionAnchorProps = {
  x: number;
  y: number;
  dir: AnchorDirection;
  onMove: UseDragMoveCallback;
  grid: readonly [number, number];
};

function SelectionAnchor({ x, y, dir, onMove, grid }: SelectionAnchorProps) {
  const ref = createRef<SVGRectElement>();
  useDrag({
    onDragMove: onMove,
    setNodeRef: ref,
    middleware: ([x, y]) => {
      const shiftX =
        horizontalSign(dir) > 0
          ? -SELECTION_ANCHOR_SIZE / 2
          : SELECTION_ANCHOR_SIZE / 2;
      const shiftY =
        verticalSign(dir) > 0
          ? -SELECTION_ANCHOR_SIZE / 2
          : SELECTION_ANCHOR_SIZE / 2;
      const actualX = x + shiftX;
      const actualY = y + shiftY;

      let newX = actualX < 0 ? 0 : actualX;
      let newY = actualY < 0 ? 0 : actualY;

      newX = Math.ceil((newX - grid[0] / 2) / grid[0]) * grid[0];
      newY = Math.ceil((newY - grid[1] / 2) / grid[1]) * grid[1];

      console.log([newX, newY]);

      return [newX - shiftX, newY - shiftY];
    },
  });
  return (
    <rect
      className={classNames("editor__scale_node")}
      data-dir={dir}
      x={x + (horizontalSign(dir) > 0 ? 0 : -SELECTION_ANCHOR_SIZE)}
      y={y + (verticalSign(dir) > 0 ? 0 : -SELECTION_ANCHOR_SIZE)}
      width={10}
      height={10}
      {...entityTypeProps(ENTITY_SELECTION_ANCHOR)}
      ref={ref}
    ></rect>
  );
}

export default SelectionAnchor;
