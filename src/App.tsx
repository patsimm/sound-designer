import "./App.scss";
import Editor from "./editor/Editor.tsx";
import { useCallback, useEffect, useState } from "react";
import { Indicator } from "./Indicator.tsx";
import classNames from "classnames";

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
      <Editor></Editor>
    </>
  ) : (
    <button className={classNames("start-button")} onClick={start}>
      start
    </button>
  );
}

export default App;