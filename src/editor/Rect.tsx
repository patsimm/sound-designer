import classNames from "classnames";
import { ENTITY_NODE, entityTypeProps } from "./entities.ts";
import { useDrag, UseDragMoveCallback } from "./drag.hook.tsx";
import { createRef, useRef } from "react";

export function Rect({
  id,
  x,
  y,
  width,
  height,
  selected,
  onDragMove,
  grid,
}: {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  selected: boolean;
  onDragMove: UseDragMoveCallback;
  grid: readonly [number, number];
}) {
  const ref = createRef<SVGRectElement>();
  const movementBuffer = useRef<[number, number]>([0, 0]);
  useDrag({
    onDragStart: () => {
      movementBuffer.current = [0, 0];
    },
    onDragMove: onDragMove,
    setNodeRef: ref,
    middleware: ([posX, posY], [x, y]) => {
      const lastPosX = posX - x;
      const lastPosY = posY - y;

      movementBuffer.current = [
        movementBuffer.current[0] + x,
        movementBuffer.current[1] + y,
      ];
      const [bufferX, bufferY] = movementBuffer.current;

      const movementX = Math.trunc(bufferX / grid[0]) * grid[0];
      const movementY = Math.trunc(bufferY / grid[1]) * grid[1];

      movementBuffer.current = [bufferX - movementX, bufferY - movementY];

      return [lastPosX + movementX, lastPosY + movementY];
    },
  });

  return (
    <rect
      ref={ref}
      data-id={id}
      className={classNames("editor__node", "editor__node--clickable", {
        "editor__node--selected": selected,
      })}
      width={width}
      height={height}
      x={x}
      y={y}
      {...entityTypeProps(ENTITY_NODE)}
    ></rect>
  );
}
