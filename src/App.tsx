import "./App.scss";
import Editor from "./editor/Editor.tsx";
import { Indicator } from "./Indicator.tsx";
import Toolbar from "./Toolbar.tsx";
import ContextBar from "./ContextBar.tsx";
import Playbar from "./Playbar.tsx";
import { useCallback, useState } from "react";
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
    <>
      <Indicator />
      <Editor />
      <Toolbar />
      <ContextBar />
      <Playbar isPlaying={started} onClickPlay={start} onClickStop={stop} />
    </>
  );
}

export default App;
