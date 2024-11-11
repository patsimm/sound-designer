import classNames from "classnames";
import "./Indicator.scss";
import { useAppStore } from "./App.store.ts";

export function Indicator() {
  const pos = useAppStore((state) => state.indicatorPos);
  return (
    <div className={classNames("time-indicator__container")}>
      <div
        className={classNames("time-indicator__indicator")}
        style={{ transform: `translateX(${pos}px)` }}
      ></div>
    </div>
  );
}
