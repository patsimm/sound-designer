import {
  useDrag,
  UseDragEndCallback,
  UseDragMoveCallback,
} from "../use-drag.hook.ts";
import { useState } from "react";
import { useAppStore } from "../../App.store.ts";
import { ENTITY_NODE_SKELETON } from "../entities.ts";
import classNames from "classnames";

type AddNodeToolProps = {
  onAdded: (nodeId: string) => void;
};

function AddNodeTool({ onAdded }: AddNodeToolProps) {
  const [anchor, setAnchor] = useState<[number, number] | null>(null);
  const [mouse, setMouse] = useState<[number, number] | null>(null);
  const addRect = useAppStore((state) => state.addRect);

  const rect = anchor &&
    mouse && {
      x: Math.min(anchor[0], mouse[0]),
      y: Math.min(anchor[1], mouse[1]),
      width: Math.abs(anchor[0] - mouse[0]),
      height: Math.abs(anchor[1] - mouse[1]),
    };

  const handleDragMove: UseDragMoveCallback = ({
    x,
    y,
    pointerX,
    pointerY,
  }) => {
    setAnchor((anchor) =>
      anchor === null ? [pointerX - x, pointerY - y] : anchor,
    );
    setMouse((currentMouse) => {
      if (currentMouse === null || anchor === null)
        return [pointerX - x, pointerY - y];
      return [currentMouse[0] + x, currentMouse[1] + y];
    });
    return true;
  };

  const handleDragEnd: UseDragEndCallback = () => {
    if (rect == null) return;
    const added = addRect(rect.x, rect.y, rect.width, rect.height);
    setMouse(null);
    setAnchor(null);
    if (added === undefined) return;
    onAdded(added);
  };

  useDrag({
    onDragMove: handleDragMove,
    onDragEnd: handleDragEnd,
  });
  return rect ? (
    <rect
      className={classNames("editor__node-skeleton")}
      data-type={ENTITY_NODE_SKELETON}
      x={rect.x}
      y={rect.y}
      width={rect.width}
      height={rect.height}
    />
  ) : (
    <></>
  );
}

export default AddNodeTool;
