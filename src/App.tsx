import "./App.scss";
import Editor from "./editor/Editor.tsx";
import { useCallback, useEffect, useState } from "react";
import { Indicator } from "./Indicator.tsx";
import classNames from "classnames";
import Toolbar from "./Toolbar.tsx";
import ContextBar from "./ContextBar.tsx";

function App({ audioContext }: { audioContext: AudioContext }) {
  const [started, setStarted] = useState(false);

  const start = useCallback(async () => {
    setStarted(true);
    await audioContext.resume();
  }, [audioContext]);

  useEffect(() => {
    if (audioContext.state == "running") {
      start();
      return;
    }
  }, [audioContext, start]);

  return started ? (
    <>
      <Indicator />
      <Editor />
      <Toolbar />
      <ContextBar />
    </>
  ) : (
    <button
      className={classNames("start-button", "button", "glow")}
      onClick={start}
    >
      start
    </button>
  );
}

export default App;
