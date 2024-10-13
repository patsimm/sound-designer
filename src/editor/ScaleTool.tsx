import { useAppStore } from "../App.store.ts";
import classNames from "classnames";

function ScaleTool() {
  const selectedNode = useAppStore((state) =>
    state.selectedNodeId !== null ? state.nodes[state.selectedNodeId] : null,
  );

  return selectedNode !== null ? (
    <>
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
    </>
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
      x={x - 5}
      y={y - 5}
      width={10}
      height={10}
    ></rect>
  );
}

export default ScaleTool;
