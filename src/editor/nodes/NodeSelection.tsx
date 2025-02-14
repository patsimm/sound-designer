import { useCallback } from "react";
import SelectionAnchor, { SELECTION_ANCHOR_SIZE } from "./SelectionAnchor.tsx";
import { AnchorDirection, isAnchorDirection } from "../anchor-direction.ts";
import { EditorNode } from "../entities.ts";
import { UseDragMoveDetail } from "../drag.hook.tsx";

export type SelectionAnchorMoveEventHandler = (
  dir: AnchorDirection,
  x: number,
  y: number,
) => void;

export type NodeSelectionProps = {
  node: EditorNode;
  onSelectionAnchorMove: SelectionAnchorMoveEventHandler;
  grid: readonly [number, number];
};

function NodeSelection({
  node,
  onSelectionAnchorMove,
  grid,
}: NodeSelectionProps) {
  const handleDragMove = useCallback(
    (
      dir: AnchorDirection,
      { target, pointerX, pointerY }: UseDragMoveDetail,
    ) => {
      if (dir === null || !isAnchorDirection(dir)) return false;
      if (target == null || !(target instanceof Element)) return false;

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

  return (
    <g>
      <SelectionAnchor
        grid={grid}
        x={node.x}
        y={node.y}
        dir="nw"
        onMove={(detail) => handleDragMove("nw", detail)}
      />
      <SelectionAnchor
        grid={grid}
        x={node.x + node.width}
        y={node.y}
        dir="ne"
        onMove={(detail) => handleDragMove("ne", detail)}
      />
      <SelectionAnchor
        grid={grid}
        x={node.x}
        y={node.y + node.height}
        dir="sw"
        onMove={(detail) => handleDragMove("sw", detail)}
      />
      <SelectionAnchor
        grid={grid}
        x={node.x + node.width}
        y={node.y + node.height}
        dir="se"
        onMove={(detail) => handleDragMove("se", detail)}
      />
    </g>
  );
}

export default NodeSelection;
