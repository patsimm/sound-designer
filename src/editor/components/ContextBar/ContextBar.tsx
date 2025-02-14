import "./ContextBar.scss";

import classNames from "classnames";

import { useAppStore } from "../../../App.store.ts";
import EditSvg from "../../../assets/edit.svg?react";
import ColorChooser from "../ColorChooser";
import ContextBarButton from "./ContextBarButton.tsx";
import ContextBarSubMenu from "./ContextBarSubMenu.tsx";

function ContextBar() {
  const selectedNode = useAppStore((state) =>
    state.selectedNodeId !== null ? state.nodes[state.selectedNodeId] : null,
  );
  const removeNode = useAppStore((state) => state.removeNode);
  const setSelectedNodeId = useAppStore((state) => state.setSelectedNodeId);
  const changeColor = useAppStore((state) => state.changeColor);

  return (
    selectedNode && (
      <div
        className={classNames("context-bar")}
        style={{
          left: selectedNode.x + selectedNode.width / 2,
          top: selectedNode.y,
        }}
      >
        <ContextBarButton
          onClick={() => {
            const nodeId = selectedNode.id;
            setSelectedNodeId(null);
            removeNode(nodeId);
          }}
          icon={<EditSvg color={"red"} />}
          label={"Remove"}
        />
        <hr />
        <ContextBarSubMenu
          icon={
            <span
              className={classNames("context-bar__color-circle")}
              style={{
                background: selectedNode.color,
              }}
            />
          }
          label={"Choose color..."}
        >
          <ColorChooser
            colors={[
              "var(--color-primary-100)",
              "var(--color-secondary-100)",
              "var(--color-tertiary-100)",
            ]}
            onColorChosen={(color) => {
              changeColor(selectedNode.id, color);
            }}
          />
        </ContextBarSubMenu>
      </div>
    )
  );
}

export default ContextBar;
