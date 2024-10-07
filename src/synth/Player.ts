import { useAppStore } from "../App.store.ts";
import { startLooping } from "./Looper.ts";
import { SoundNode } from "./SoundNode.ts";
import { factor } from "./bpm.ts";
import { getSoundNodeStates, subscribeToNodeState } from "./SoundNodeState.ts";

function startPlayer(context: AudioContext) {
  const soundNodes: { [key: string]: SoundNode } = {};

  startLooping(factor, () => {
    const nodeStates = getSoundNodeStates();
    for (const [id, nodeState] of Object.entries(nodeStates)) {
      if (!Object.keys(soundNodes).includes(id)) {
        soundNodes[id] = new SoundNode(id, context);
        subscribeToNodeState(id, (nodeState) =>
          soundNodes[id].updateState(nodeState),
        );
        soundNodes[id].updateState(nodeState);
      }
      soundNodes[id].nextState(nodeState);
    }
  });

  const updateFactor = () => {
    const pos = (context.currentTime % factor) / factor;
    useAppStore.getState().setIndicatorPos(pos * 100);
    requestAnimationFrame(() => updateFactor());
  };
  updateFactor();
}

export default startPlayer;
