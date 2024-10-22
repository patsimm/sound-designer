import { useDrag, UseDragMoveCallback } from "../use-drag.hook.ts";
import { ENTITY_NODE, isElementOfEntityType } from "../entities.ts";
import { useAppStore } from "../../App.store.ts";
import NodeSelection, {
  SelectionAnchorMoveEventHandler,
} from "../NodeSelection.tsx";
import { horizontalSign, verticalSign } from "../anchor-direction.ts";

function MoveTool() {
  const move = useAppStore((state) => state.move);
  const resize = useAppStore((state) => state.resize);
  const minSizeRect = useAppStore((state) => state.minSizeNode);

  const handleDragMove: UseDragMoveCallback = ({ target, x, y }) => {
    if (!(target instanceof SVGElement)) return false;
    if (!isElementOfEntityType(target, ENTITY_NODE)) return false;
    const draggedNodeId = target.getAttribute("data-id");
    if (draggedNodeId == null) return false;

    move(draggedNodeId, x, y);
    setSelectedNodeId(draggedNodeId);
    return true;
  };

  useDrag({
    onDragMove: handleDragMove,
  });

  const selectedNode = useAppStore((state) =>
    state.selectedNodeId !== null ? state.nodes[state.selectedNodeId] : null,
  );
  const setSelectedNodeId = useAppStore((state) => state.setSelectedNodeId);

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
      node={selectedNode}
      onSelectionAnchorMove={handleSelectionAnchorMove}
    />
  ) : (
    <></>
  );
}

export default MoveTool;
