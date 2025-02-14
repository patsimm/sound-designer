import ContextBarButton from "./ContextBarButton.tsx";
import classNames from "classnames";
import React, { useId } from "react";

export type ContextBarSubMenuProps = {
  icon: React.ReactNode;
  label: string;
};

function ContextBarSubMenu({
  icon,
  label,
  children,
}: React.PropsWithChildren<ContextBarSubMenuProps>) {
  const [isOpen, setIsOpen] = React.useState(false);
  const menuId = useId();
  return (
    <div className={classNames("context-bar__sub-menu-button-wrapper")}>
      <ContextBarButton
        onClick={() => setIsOpen((open) => !open)}
        icon={icon}
        label={label}
        expanded={isOpen}
        dropdown
        aria-haspopup={"dialog"}
        aria-controls={menuId}
        aria-expanded={isOpen}
      />
      <div
        id={menuId}
        role="dialog"
        className={classNames("context-bar__sub-menu", {
          "context-bar__sub-menu--visible": isOpen,
        })}
      >
        <div className={classNames("context-bar__sub-menu-content")}>
          {children}
        </div>
      </div>
    </div>
  );
}

export default ContextBarSubMenu;
