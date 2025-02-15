import "./ContextBar.scss";

import classNames from "classnames";

import { useAppStore } from "../../../App.store.ts";
import EditSvg from "../../../assets/edit.svg?react";
import ColorChooser from "../ColorChooser";
import ContextBarButton from "./ContextBarButton.tsx";
import ContextBarSubMenu from "./ContextBarSubMenu.tsx";
import Color from "color";

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
                background: Color(selectedNode.color).hex(),
              }}
            />
          }
          label={"Choose color..."}
        >
          <ColorChooser
            colors={[
              "hsla(224, 88%, 55%, 1)",
              "hsla(330, 90%, 62%, 1)",
              "hsla(40, 90%, 62%, 1)",
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
