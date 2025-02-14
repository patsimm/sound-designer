import { selectGrid, useAppStore } from "../../App.store.ts";
import NodeSelection, {
  SelectionAnchorMoveEventHandler,
} from "../nodes/NodeSelection.tsx";
import { horizontalSign, verticalSign } from "../anchor-direction.ts";
import { useShallow } from "zustand/react/shallow";

function MoveTool() {
  const move = useAppStore((state) => state.move);
  const resize = useAppStore((state) => state.resize);
  const minSizeRect = useAppStore(useShallow(selectGrid));
  const grid = useAppStore(useShallow(selectGrid));

  const selectedNode = useAppStore((state) =>
    state.selectedNodeId !== null ? state.nodes[state.selectedNodeId] : null,
  );

  const handleSelectionAnchorMove: SelectionAnchorMoveEventHandler = (
    dir,
    x,
    y,
  ) => {
    if (!selectedNode) return;
    const xSign = horizontalSign(dir);
    const ySign = verticalSign(dir);

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
  };

  return selectedNode ? (
    <NodeSelection
      grid={grid}
      node={selectedNode}
      onSelectionAnchorMove={handleSelectionAnchorMove}
    />
  ) : (
    <></>
  );
}

export default MoveTool;
