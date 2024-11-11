import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import Player from "./synth/Player.ts";

const audioContext = new AudioContext();
const player = new Player(audioContext);

audioContext
  .suspend()
  .then(() => player.start())
  .then(() =>
    createRoot(document.getElementById("root")!).render(
      <StrictMode>
        <App player={player} />
      </StrictMode>,
    ),
  );
