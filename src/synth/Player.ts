import { useAppStore } from "../App.store.ts";
import { startLooping } from "./Looper.ts";
import { SoundNode } from "./SoundNode.ts";
import { calcLoopLength, timeToPos } from "./bpm.ts";
import { getSoundNodeStates, subscribeToNodeState } from "./SoundNodeState.ts";
import { debounce } from "../helpers.ts";

function startPlayer(context: AudioContext) {
  const soundNodes: { [key: string]: SoundNode } = {};
  const { bpm } = useAppStore.getState();

  const setUpdateInterval = startLooping(calcLoopLength(bpm), () => {
    const nodeStates = getSoundNodeStates();
    for (const [id, nodeState] of Object.entries(nodeStates)) {
      if (!Object.keys(soundNodes).includes(id)) {
        soundNodes[id] = new SoundNode(id, nodeState, context);
        subscribeToNodeState(
          id,
          debounce((nodeState) => (soundNodes[id].state = nodeState)),
        );
      }
      soundNodes[id].loop();
    }
  });

  useAppStore.subscribe(
    (state, prevState) =>
      state.bpm !== prevState.bpm &&
      setUpdateInterval(calcLoopLength(state.bpm)),
  );

  const updateFactor = () => {
    const pos = timeToPos(context.currentTime);
    useAppStore.getState().setIndicatorPos(pos);
    requestAnimationFrame(() => updateFactor());
  };
  updateFactor();
}

export default startPlayer;
