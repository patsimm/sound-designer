import "./Toolbar.scss";

import classNames from "classnames";

import { useAppStore } from "../../../App.store.ts";
import HandSvg from "../../../assets/hand.svg?react";
import SquareSvg from "../../../assets/square.svg?react";
import { TOOL_ADD_NODE, TOOL_MOVE } from "../../tools/tools.ts";
import ButtonSquare from "../ButtonSquare/ButtonSquare.tsx";

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
