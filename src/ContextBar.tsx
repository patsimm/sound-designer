import classNames from "classnames";
import "./ContextBar.scss";
import { useAppStore } from "./App.store.ts";
import EditSvg from "./assets/edit.svg?react";

function ContextBar() {
  const selectedNode = useAppStore((state) =>
    state.selectedNodeId !== null ? state.nodes[state.selectedNodeId] : null,
  );
  const removeNode = useAppStore((state) => state.removeNode);
  const setSelectedNodeId = useAppStore((state) => state.setSelectedNodeId);

  return (
    selectedNode && (
      <div
        className={classNames("context-bar")}
        style={{
          left: selectedNode.x + selectedNode.width / 2,
          top: selectedNode.y,
        }}
      >
        <button
          className={classNames("context-bar__button")}
          onClick={() => {
            const nodeId = selectedNode.id;
            setSelectedNodeId(null);
            removeNode(nodeId);
          }}
        >
          <span className={classNames("context-bar__button-icon")}>
            <EditSvg color={"red"} />
          </span>
        </button>
      </div>
    )
  );
}

export default ContextBar;
