import classNames from "classnames";
import "./Toolbar.scss";
import { TOOL_ADD_NODE, TOOL_MOVE } from "./editor/tools/tools.ts";
import { useAppStore } from "./App.store.ts";
import SquareSvg from "./assets/square.svg?react";
import HandSvg from "./assets/hand.svg?react";
import ButtonSquare from "./ButtonSquare.tsx";

function Toolbar() {
  const setTool = useAppStore((state) => state.setTool);
  const tool = useAppStore((state) => state.tool);
  return (
    <div className={classNames("toolbar__container")}>
      <div className={classNames("toolbar")}>
        <ButtonSquare
          title={"Move"}
          onClick={() => setTool(TOOL_MOVE)}
          selected={tool === TOOL_MOVE}
          icon={<HandSvg />}
        />
        <ButtonSquare
          title={"Add Rectangle"}
          onClick={() => setTool(TOOL_ADD_NODE)}
          selected={tool === TOOL_ADD_NODE}
          icon={<SquareSvg />}
        />
      </div>
    </div>
  );
}

export default Toolbar;
