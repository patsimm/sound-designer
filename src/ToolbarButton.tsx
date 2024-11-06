import classNames from "classnames";
import { ReactNode } from "react";

function ToolbarButton({
  onClick,
  selected,
  title,
  icon,
}: {
  onClick: () => void;
  selected: boolean;
  title: string;
  icon: ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      aria-selected={selected}
      className={classNames("toolbar__button", {
        "toolbar__button--selected": selected,
        glow: selected,
      })}
      title={title}
    >
      <span aria-hidden={true} className={classNames("toolbar__button-icon")}>
        {icon}
      </span>
    </button>
  );
}

export default ToolbarButton;
