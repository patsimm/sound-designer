import "./Playbar.scss";
import classNames from "classnames";
import PlayOutlineSvg from "../../../assets/play-outline.svg?react";
import StopOutlineSvg from "../../../assets/stop-outline.svg?react";
import PlayFillSvg from "../../../assets/play-fill.svg?react";
import StopFillSvg from "../../../assets/stop-fill.svg?react";
import IconButton from "../IconButton/IconButton.tsx";

export type PlayerControlBarProps = {
  isPlaying: boolean;
  onClickPlay: () => void;
  onClickStop: () => void;
};

function Playbar({
  isPlaying,
  onClickPlay,
  onClickStop,
}: PlayerControlBarProps) {
  return (
    <div className={classNames("playbar")}>
      <IconButton
        title={"Stop"}
        onClick={() => onClickStop()}
        icon={<StopOutlineSvg />}
        hoverIcon={<StopFillSvg />}
        className={"playbar__stop-button"}
      />
      <IconButton
        title={"Play"}
        onClick={() => onClickPlay()}
        selected={isPlaying}
        icon={isPlaying ? <PlayFillSvg /> : <PlayOutlineSvg />}
        hoverIcon={<PlayFillSvg />}
        className={classNames("playbar__play-button", {
          "playbar__play-button--active": isPlaying,
        })}
      />
    </div>
  );
}

export default Playbar;
