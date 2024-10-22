import classNames from "classnames";
import {
  AnchorDirection,
  horizontalSign,
  verticalSign,
} from "./anchor-direction.ts";
import { ENTITY_SELECTION_ANCHOR, entityTypeProps } from "./entities.ts";

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
      data-dir={dir}
      x={x + (horizontalSign(dir) > 0 ? 0 : -SELECTION_ANCHOR_SIZE)}
      y={y + (verticalSign(dir) > 0 ? 0 : -SELECTION_ANCHOR_SIZE)}
      width={10}
      height={10}
      {...entityTypeProps(ENTITY_SELECTION_ANCHOR)}
    ></rect>
  );
}

export default SelectionAnchor;
