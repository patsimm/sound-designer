import "./ButtonSquare.scss";

import classNames from "classnames";
import React, { ButtonHTMLAttributes, ReactNode } from "react";

import ArrowDownSvg from "../../../assets/arrow-down.svg?react";

export type ButtonSquareProps = {
  label: string;
  icon: ReactNode;
  size?: "small" | "large";
  hoverIcon?: ReactNode;
  dropdown?: boolean;
  expanded?: boolean;
  active?: boolean;
  className?: string;
} & Pick<
  React.DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >,
  | "onClick"
  | "role"
  | "aria-selected"
  | "aria-pressed"
  | "aria-haspopup"
  | "aria-controls"
>;

function ButtonSquare({
  onClick,
  label,
  size = "large",
  icon,
  hoverIcon,
  dropdown,
  expanded,
  className,
  role,
  active = false,
  "aria-selected": ariaSelected,
  "aria-pressed": ariaPressed,
  "aria-haspopup": ariaHaspopup,
  "aria-controls": ariaControls,
}: ButtonSquareProps) {
  return (
    <button
      role={role}
      onClick={onClick}
      className={classNames(
        className,
        "button-square",
        `button-square--${size}`,
        {
          "button-square--active": active || expanded,
          "button-square--dropdown": dropdown,
        },
      )}
      title={label}
      aria-label={label}
      aria-expanded={expanded}
      aria-selected={ariaSelected}
      aria-pressed={ariaPressed}
      aria-haspopup={ariaHaspopup}
      aria-controls={ariaControls}
    >
      <span aria-hidden={true} className={classNames("button-square__icon")}>
        {icon}
      </span>
      <span
        aria-hidden={true}
        className={classNames(
          "button-square__icon",
          "button-square__icon--hover",
        )}
      >
        {hoverIcon || icon}
      </span>
      {dropdown && (
        <span
          aria-hidden={true}
          className={classNames("button-square__dropdown-icon")}
        >
          <ArrowDownSvg />
        </span>
      )}
    </button>
  );
}

export default ButtonSquare;
