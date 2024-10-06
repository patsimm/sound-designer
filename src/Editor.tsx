import "./Editor.scss";
import { MouseEventHandler, useReducer, useState } from "react";
import classNames from "classnames";

type Rect = { x: number; y: number; width: number; height: number };

type State = {
  [id: string]: Rect;
};

type Action = {
  type: "move";
  nodeId: string;
  movementX: number;
  movementY: number;
};

function Editor() {
  const [draggedElement, setDraggedElement] = useState<SVGElement | null>(null);

  const handleMouseDown: MouseEventHandler<SVGSVGElement> = (ev) => {
    if (ev.target instanceof SVGElement) setDraggedElement(ev.target);
    setSelectedNodeId(null);
  };

  const handleMouseUp: MouseEventHandler<SVGSVGElement> = () => {
    setDraggedElement(null);
  };

  const handleMouseMove: MouseEventHandler<SVGSVGElement> = (ev) => {
    const draggedNodeId = draggedElement?.getAttribute("data-id");
    if (typeof draggedNodeId != "string") {
      return;
    }
    ev.preventDefault();
    dispatch({
      type: "move",
      nodeId: draggedNodeId,
      movementX: ev.movementX,
      movementY: ev.movementY,
    });
  };

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const handleClick: MouseEventHandler<SVGSVGElement> = (ev) => {
    if (!(ev.target instanceof SVGElement)) return;
    console.log(ev.target);
    const clickedNodeId = ev.target.getAttribute("data-id");
    setSelectedNodeId(clickedNodeId);
  };

  const [rects, dispatch] = useReducer(
    (state: State, action: Action) => {
      switch (action.type) {
        case "move":
          return {
            ...state,
            [action.nodeId]: {
              ...state[action.nodeId],
              x: state[action.nodeId].x + action.movementX,
              y: state[action.nodeId].y + action.movementY,
            },
          };
      }
    },
    {
      "1": { x: 200, y: 200, width: 250, height: 250 },
      "2": { x: 20, y: 20, width: 25, height: 25 },
    },
  );

  return (
    <div className={"editor"}>
      <svg
        className={"editor__content"}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onClick={handleClick}
      >
        {Object.entries(rects).map(([id, config]) => (
          <Rect key={id} id={id} selected={selectedNodeId === id} {...config} />
        ))}
      </svg>
    </div>
  );
}

function Rect({
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

export default Editor;
