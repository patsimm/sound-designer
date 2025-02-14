import { createContext } from "react";

import {
  UseDragEndCallback,
  UseDragMoveCallback,
  UseDragStartCallback,
} from "./drag.hook.tsx";

export type DragContext = {
  initDrag: (
    ev: PointerEvent,
    el: (Element & GlobalEventHandlers) | null,
    moveCallback: UseDragMoveCallback,
    startCallback?: UseDragStartCallback,
    endCallback?: UseDragEndCallback,
  ) => void;
};

export const dragContext = createContext<DragContext>({
  initDrag: () => {},
});
