import classNames from "classnames";
import ArrowDownSvg from "../../../assets/arrow-down.svg?react";
import React from "react";

export type ContextBarButtonProps = {
  label: string;
  onClick?: React.DOMAttributes<HTMLButtonElement>["onClick"];
  icon: React.ReactNode;
  dropdown?: boolean;
  expanded?: boolean;
  "aria-haspopup"?: React.AriaAttributes["aria-haspopup"];
  "aria-controls"?: React.AriaAttributes["aria-controls"];
};

function ContextBarButton({
  onClick,
  icon,
  label,
  dropdown = false,
  expanded = false,
  "aria-haspopup": ariaHaspopup,
  "aria-controls": ariaControls,
}: ContextBarButtonProps) {
  return (
    <button
      type="button"
      className={classNames("context-bar__button", {
        "context-bar__button--dropdown": dropdown,
        "context-bar__button--expanded": expanded,
      })}
      onClick={onClick}
      title={label}
      aria-expanded={expanded}
      aria-label={label}
      aria-haspopup={ariaHaspopup}
      aria-controls={ariaControls}
    >
      <span className={classNames("context-bar__icon-wrapper")}>{icon}</span>
      {dropdown && (
        <span className={classNames("context-bar__dropdown-icon")}>
          <ArrowDownSvg />
        </span>
      )}
    </button>
  );
}

export default ContextBarButton;
