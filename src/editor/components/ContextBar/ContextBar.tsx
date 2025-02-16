import "./ContextBar.scss";

import classNames from "classnames";
import Color from "color";

import { useAppStore } from "../../../App.store.ts";
import EditSvg from "../../../assets/edit.svg?react";
import ButtonSquare from "../ButtonSquare";
import ColorChooser from "../ColorChooser";
import SubMenu from "../SubMenu/SubMenu.tsx";

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
        <ButtonSquare
          size="small"
          onClick={() => {
            const nodeId = selectedNode.id;
            setSelectedNodeId(null);
            removeNode(nodeId);
          }}
          icon={<EditSvg color={"red"} />}
          label={"Remove"}
        />
        <hr />
        <SubMenu
          ButtonComponent={({ ...props }) => (
            <ButtonSquare
              size="small"
              icon={
                <span
                  className={classNames("context-bar__color-circle")}
                  style={{
                    background: Color(selectedNode.color).hex(),
                  }}
                />
              }
              label="Choose color..."
              dropdown
              {...props}
            />
          )}
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
        </SubMenu>
      </div>
    )
  );
}

export default ContextBar;
