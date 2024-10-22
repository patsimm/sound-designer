import classNames from "classnames";
import { ENTITY_NODE, entityTypeProps } from "./entities.ts";

export function Rect({
  id,
  x,
  y,
  width,
  height,
  selected,
}: {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  selected: boolean;
}) {
  return (
    <rect
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
