import classNames from "classnames";
import "./Indicator.scss";
import { useAppStore } from "./App.store.ts";

export function Indicator() {
  const pos = useAppStore((state) => state.indicatorPos);
  return (
    <div style={{ left: `${pos}%` }} className={classNames("indicator")}></div>
  );
}
