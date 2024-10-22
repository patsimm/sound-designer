import classNames from "classnames";
import "./Toolbar.scss";
import { TOOL_ADD_NODE, TOOL_MOVE } from "./editor/tools/tools.ts";
import { useAppStore } from "./App.store.ts";

function Toolbar() {
  const setTool = useAppStore((state) => state.setTool);
  const tool = useAppStore((state) => state.tool);
  return (
    <div className={classNames("toolbar")}>
      <button
        onClick={() => setTool(TOOL_MOVE)}
        aria-selected={tool === TOOL_MOVE}
        className={classNames("toolbar__button", {
          "toolbar__button--selected": tool === TOOL_MOVE,
        })}
      >
        move
      </button>
      <button
        onClick={() => setTool(TOOL_ADD_NODE)}
        aria-selected={tool === TOOL_ADD_NODE}
        className={classNames("toolbar__button", {
          "toolbar__button--selected": tool === TOOL_ADD_NODE,
        })}
      >
        add_node
      </button>
    </div>
  );
}

export default Toolbar;
