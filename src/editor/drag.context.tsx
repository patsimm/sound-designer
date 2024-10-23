import { createContext, createRef, RefObject } from "react";

export const dragContext = createContext<{ target: RefObject<HTMLDivElement> }>(
  {
    target: createRef(),
  },
);
