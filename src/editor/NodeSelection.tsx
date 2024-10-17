import { Node } from "../App.store.ts";
import { useDrag, UseDragMoveCallback } from "./use-drag.hook.ts";
import { useCallback } from "react";
import SelectionAnchor, { SELECTION_ANCHOR_SIZE } from "./SelectionAnchor.tsx";
import { AnchorDirection, isAnchorDirection } from "./anchor-direction.ts";

export type SelectionAnchorMoveEventHandler = (
  dir: AnchorDirection,
  x: number,
  y: number,
) => void;

export type NodeSelectionProps = {
  node: Node;
  onSelectionAnchorMove: SelectionAnchorMoveEventHandler;
};

function NodeSelection({ node, onSelectionAnchorMove }: NodeSelectionProps) {
  const handleDragMove: UseDragMoveCallback = useCallback(
    ({ target, pointerX, pointerY }) => {
      if (!(target instanceof Element)) return false;
      const dir = target.getAttribute("data-dir");
      if (dir === null || !isAnchorDirection(dir)) return false;

      const rect = target.getBoundingClientRect();
      const posX = rect.x + SELECTION_ANCHOR_SIZE / 2;
      const posY = rect.y + SELECTION_ANCHOR_SIZE / 2;

      const x = pointerX - posX;
      const y = pointerY - posY;

      onSelectionAnchorMove(dir, x, y);
      return true;
    },
    [onSelectionAnchorMove],
  );

  useDrag({
    onDragMove: handleDragMove,
  });

  return (
    <g>
      <SelectionAnchor x={node.x} y={node.y} dir="nw" />
      <SelectionAnchor x={node.x + node.width} y={node.y} dir="ne" />
      <SelectionAnchor x={node.x} y={node.y + node.height} dir="sw" />
      <SelectionAnchor
        x={node.x + node.width}
        y={node.y + node.height}
        dir="se"
      />
    </g>
  );
}

export default NodeSelection;
