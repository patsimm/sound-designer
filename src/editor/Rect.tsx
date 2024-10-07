import classNames from "classnames";

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
      fill={"lightgreen"}
    ></rect>
  );
}
