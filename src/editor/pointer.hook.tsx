import { useCallback, useEffect, useState } from "react";

export function usePointerPos() {
  const [pointerPos, setPointerPos] = useState<[number, number] | null>(null);

  const handlePointerMove = useCallback((ev: PointerEvent) => {
    setPointerPos([ev.clientX, ev.clientY]);
  }, []);

  useEffect(() => {
    document.addEventListener("pointermove", handlePointerMove);
    return () => {
      document.removeEventListener("pointermove", handlePointerMove);
    };
  }, [handlePointerMove]);

  return pointerPos;
}
