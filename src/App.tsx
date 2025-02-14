import "./App.scss";

import classNames from "classnames";
import { useCallback, useState } from "react";

import ContextBar from "./editor/components/ContextBar";
import Playbar from "./editor/components/Playbar";
import Toolbar from "./editor/components/Toolbar";
import Editor from "./editor/Editor.tsx";
import Player from "./synth/Player.ts";

function App({ player }: { player: Player }) {
  const [started, setStarted] = useState(player.state == "playing");

  const start = useCallback(async () => {
    setStarted(true);
    await player.play();
  }, [player]);

  const stop = useCallback(async () => {
    setStarted(false);
    await player.stop();
  }, [player]);

  return (
    <div className={classNames("app__main")}>
      <Editor />
      <Toolbar />
      <ContextBar />
      <Playbar isPlaying={started} onClickPlay={start} onClickStop={stop} />
    </div>
  );
}

export default App;
