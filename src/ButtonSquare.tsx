import classNames from "classnames";
import { ReactNode } from "react";
import "./ButtonSquare.scss";

type ButtonSquareProps = {
  onClick: () => void;
  title: string;
  icon: ReactNode;
  selected?: boolean;
};

function ButtonSquare({
  onClick,
  title,
  icon,
  selected = false,
}: ButtonSquareProps) {
  return (
    <button
      onClick={onClick}
      aria-selected={selected}
      className={classNames("button-square", {
        "button-square--selected": selected,
      })}
      title={title}
    >
      <span aria-hidden={true} className={classNames("button-square__icon")}>
        {icon}
      </span>
    </button>
  );
}

export default ButtonSquare;
