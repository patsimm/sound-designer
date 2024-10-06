import "./App.scss";
import Editor from "./Editor.tsx";
import classNames from "classnames";
import { useState } from "react";

function Indicator({ pos }: { pos: number }) {
  return (
    <div style={{ left: `${pos}%` }} className={classNames("indicator")}></div>
  );
}

function App() {
  const [context, setContext] = useState<AudioContext | null>(null);

  const start = () => {
    const context = new AudioContext();

    const oscillator = new OscillatorNode(context);
    oscillator.type = "sine";
    oscillator.frequency.value = 300;
    oscillator.start(context.currentTime);
    const gainNode = new GainNode(context);

    gainNode.gain.value = 0.0;

    oscillator.connect(gainNode).connect(context.destination);
    setContext(context);
  };

  return context ? (
    <>
      <Indicator pos={5} />
      <Editor></Editor>
    </>
  ) : (
    <button onClick={start}>start</button>
  );
}

export default App;
