import classNames from "classnames";
import { ReactNode } from "react";
import "./IconButton.scss";

type IconButtonProps = {
  onClick: () => void;
  title: string;
  icon: ReactNode;
  hoverIcon?: ReactNode;
  selected?: boolean;
  className?: string | undefined;
};

function IconButton({
  onClick,
  title,
  icon,
  hoverIcon,
  selected = false,
  className,
}: IconButtonProps) {
  return (
    <button
      onClick={onClick}
      aria-selected={selected}
      className={classNames(className, "icon-button", {
        "icon-button--selected": selected,
      })}
      title={title}
    >
      <span aria-hidden={true} className={classNames("icon-button__icon")}>
        {icon}
      </span>
      <span
        aria-hidden={true}
        className={classNames("icon-button__icon-hover")}
      >
        {hoverIcon || icon}
      </span>
    </button>
  );
}

export default IconButton;
