import "./index.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App.tsx";
import Player from "./synth/Player.ts";

const player = new Player();
player.start();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App player={player} />
  </StrictMode>,
);
