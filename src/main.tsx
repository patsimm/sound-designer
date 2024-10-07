import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import startPlayer from "./synth/Player.ts";

const audioContext = new AudioContext();
audioContext
  .suspend()
  .then(() => startPlayer(audioContext))
  .then(() =>
    createRoot(document.getElementById("root")!).render(
      <StrictMode>
        <App audioContext={audioContext} />
      </StrictMode>,
    ),
  );
