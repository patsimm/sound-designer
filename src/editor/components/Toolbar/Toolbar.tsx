import "./Toolbar.scss";

import classNames from "classnames";

import { useAppStore } from "../../../App.store.ts";
import HandSvg from "../../../assets/hand.svg?react";
import PlayFillSvg from "../../../assets/play-fill.svg?react";
import PlayOutlineSvg from "../../../assets/play-outline.svg?react";
import SquareSvg from "../../../assets/square.svg?react";
import StopFillSvg from "../../../assets/stop-fill.svg?react";
import StopOutlineSvg from "../../../assets/stop-outline.svg?react";
import { TOOL_ADD_NODE, TOOL_MOVE } from "../../tools/tools.ts";
import ButtonSquare from "../ButtonSquare/ButtonSquare.tsx";

export type ToolbarProps = {
  isPlaying: boolean;
  onClickPlay: () => void;
  onClickStop: () => void;
};

function Toolbar({ isPlaying, onClickPlay, onClickStop }: ToolbarProps) {
  const setTool = useAppStore((state) => state.setTool);
  const tool = useAppStore((state) => state.tool);
  return (
    <div className={classNames("toolbar__container")}>
      <div className={classNames("toolbar")}>
        <ButtonSquare
          role={"option"}
          label={"Move"}
          onClick={() => setTool(TOOL_MOVE)}
          active={tool === TOOL_MOVE}
          aria-selected={tool === TOOL_MOVE}
          icon={<HandSvg />}
        />
        <ButtonSquare
          role={"option"}
          label={"Add Rectangle"}
          onClick={() => setTool(TOOL_ADD_NODE)}
          active={tool === TOOL_ADD_NODE}
          aria-selected={tool === TOOL_ADD_NODE}
          icon={<SquareSvg />}
        />
        <hr />
        <ButtonSquare
          label={"Play"}
          onClick={() => onClickPlay()}
          icon={isPlaying ? <PlayFillSvg /> : <PlayOutlineSvg />}
          hoverIcon={<PlayFillSvg />}
          className={classNames("toolbar__play-button", {
            "toolbar__play-button--active": isPlaying,
          })}
          aria-pressed={isPlaying}
        />
        <ButtonSquare
          label={"Stop"}
          onClick={() => onClickStop()}
          icon={!isPlaying ? <StopFillSvg /> : <StopOutlineSvg />}
          hoverIcon={<StopFillSvg />}
          className={classNames("toolbar__stop-button", {
            "toolbar__stop-button--active": !isPlaying,
          })}
          aria-pressed={!isPlaying}
        />
      </div>
    </div>
  );
}

export default Toolbar;
