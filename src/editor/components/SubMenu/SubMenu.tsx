import "./SubMenu.scss";

import classNames from "classnames";
import { ElementType, PropsWithChildren, useId, useState } from "react";

import { ButtonSquareProps } from "../ButtonSquare";

export type ContextBarSubMenuProps = {
  ButtonComponent: ElementType<
    Pick<
      ButtonSquareProps,
      "aria-controls" | "aria-haspopup" | "onClick" | "expanded"
    >
  >;
};

function SubMenu({
  ButtonComponent,
  children,
}: PropsWithChildren<ContextBarSubMenuProps>) {
  const [isOpen, setIsOpen] = useState(false);
  const menuId = useId();
  return (
    <div className={classNames("sub-menu__button-wrapper")}>
      <ButtonComponent
        aria-haspopup="dialog"
        aria-controls={menuId}
        onClick={() => setIsOpen((open) => !open)}
        expanded={isOpen}
      />
      <div
        id={menuId}
        role="dialog"
        className={classNames("sub-menu", {
          "sub-menu--visible": isOpen,
        })}
      >
        <div className={classNames("sub-menu__content")}>{children}</div>
      </div>
    </div>
  );
}

export default SubMenu;
