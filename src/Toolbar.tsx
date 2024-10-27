import classNames from "classnames";
import "./Toolbar.scss";
import { TOOL_ADD_NODE, TOOL_MOVE } from "./editor/tools/tools.ts";
import { useAppStore } from "./App.store.ts";
import SquareSvg from "./assets/square.svg?react";
import HandSvg from "./assets/hand.svg?react";
import ToolbarButton from "./ToolbarButton.tsx";

function Toolbar() {
  const setTool = useAppStore((state) => state.setTool);
  const tool = useAppStore((state) => state.tool);
  return (
    <div className={classNames("toolbar")}>
      <ToolbarButton
        title={"Move"}
        onClick={() => setTool(TOOL_MOVE)}
        selected={tool === TOOL_MOVE}
        icon={<HandSvg className={classNames("toolbar__button-icon")} />}
      />
      <ToolbarButton
        title={"Add Rectangle"}
        onClick={() => setTool(TOOL_ADD_NODE)}
        selected={tool === TOOL_ADD_NODE}
        icon={<SquareSvg className={classNames("toolbar__button-icon")} />}
      />
    </div>
  );
}

export default Toolbar;
