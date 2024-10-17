import classNames from "classnames";
import {
  AnchorDirection,
  horizontalSign,
  verticalSign,
} from "./anchor-direction.ts";

export const SELECTION_ANCHOR_SIZE = 10;

type SelectionAnchorProps = {
  x: number;
  y: number;
  dir: AnchorDirection;
};

function SelectionAnchor({ x, y, dir }: SelectionAnchorProps) {
  return (
    <rect
      className={classNames("editor__scale_node")}
      data-type={"selection-anchor"}
      data-dir={dir}
      x={x + (horizontalSign(dir) > 0 ? 0 : -SELECTION_ANCHOR_SIZE)}
      y={y + (verticalSign(dir) > 0 ? 0 : -SELECTION_ANCHOR_SIZE)}
      width={10}
      height={10}
    ></rect>
  );
}

export default SelectionAnchor;
