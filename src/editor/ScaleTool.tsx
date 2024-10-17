import { useAppStore } from "../App.store.ts";
import classNames from "classnames";
import { useDrag, UseDragMoveCallback } from "./use-drag.hook.ts";
import { useCallback } from "react";

function ScaleTool() {
  const move = useAppStore((state) => state.move);
  const resize = useAppStore((state) => state.resize);
  const selectedNode = useAppStore((state) =>
    state.selectedNodeId !== null ? state.nodes[state.selectedNodeId] : null,
  );
  const minSizeRect = useAppStore((state) => state.minSizeRect);

  const handleDragMove: UseDragMoveCallback = useCallback(
    ({ target, pointerX, pointerY }) => {
      if (!(target instanceof Element) || selectedNode == null) return false;
      const dir = target.getAttribute("data-dir");
      if (dir === null) return false;

      const rect = target.getBoundingClientRect();
      const posX = rect.x + rect.width / 2;
      const posY = rect.y - rect.height / 2;

      const x = pointerX - posX;
      const y = pointerY - posY;

      const xSign = dir.charAt(1) === "e" ? 1 : -1;
      const ySign = dir.charAt(0) === "s" ? 1 : -1;

      const resizeX =
        selectedNode.width + x * xSign < minSizeRect[0]
          ? (selectedNode.width - minSizeRect[0]) * -xSign
          : x;
      const resizeY =
        selectedNode.height + y * ySign < minSizeRect[1]
          ? (selectedNode.height - minSizeRect[1]) * -ySign
          : y;

      resize(selectedNode.id, resizeX * xSign, resizeY * ySign);
      move(selectedNode.id, xSign > 0 ? 0 : resizeX, ySign > 0 ? 0 : resizeY);
      return true;
    },
    [minSizeRect, move, resize, selectedNode],
  );

  useDrag({
    onDragMove: handleDragMove,
  });

  return selectedNode !== null ? (
    <g>
      <ScaleToolNode x={selectedNode.x} y={selectedNode.y} dir="nw" />
      <ScaleToolNode
        x={selectedNode.x + selectedNode.width}
        y={selectedNode.y}
        dir="ne"
      />
      <ScaleToolNode
        x={selectedNode.x}
        y={selectedNode.y + selectedNode.height}
        dir="sw"
      />
      <ScaleToolNode
        x={selectedNode.x + selectedNode.width}
        y={selectedNode.y + selectedNode.height}
        dir="se"
      />
    </g>
  ) : (
    <></>
  );
}

type ScaleToolNodeProps = {
  x: number;
  y: number;
  dir: "ne" | "nw" | "se" | "sw";
};

function ScaleToolNode({ x, y, dir }: ScaleToolNodeProps) {
  return (
    <rect
      className={classNames("editor__scale_node")}
      data-dir={dir}
      x={x + (dir == "sw" || dir == "nw" ? -10 : 0)}
      y={y + (dir == "se" || dir == "sw" ? 0 : -10)}
      width={10}
      height={10}
    ></rect>
  );
}

export default ScaleTool;
