import { useAppStore } from "../App.store.ts";
import { startLooping } from "./Looper.ts";
import { SoundNode } from "./SoundNode.ts";
import { calcLoopLength, timeToPos } from "./bpm.ts";
import {
  computeSoundNodeStates,
  SoundNodeState,
  subscribeToNodeState,
} from "./SoundNodeState.ts";
import { debounce } from "../helpers.ts";

export default class Player {
  private readonly soundNodes: { [key: string]: SoundNode } = {};
  private readonly context: AudioContext;

  public constructor(context: AudioContext) {
    this.context = context;
    this.integrateNodeStates(
      computeSoundNodeStates(useAppStore.getInitialState().nodes),
    );
  }

  private removeNode(nodeId: string) {
    this.soundNodes[nodeId]?.dispose();
    delete this.soundNodes[nodeId];
  }

  private addNode(nodeId: string, nodeState: SoundNodeState) {
    this.soundNodes[nodeId] = new SoundNode(nodeId, nodeState, this.context);
    subscribeToNodeState(
      nodeId,
      debounce((nodeState) => {
        if (nodeState === undefined) {
          this.removeNode(nodeId);
          return;
        }
        this.soundNodes[nodeId].state = nodeState;
      }),
    );
  }

  private integrateNodeStates(nodeStates: {
    [key: string]: SoundNodeState | undefined;
  }) {
    for (const [id, nodeState] of Object.entries(nodeStates)) {
      if (!nodeState) return;
      if (!Object.keys(this.soundNodes).includes(id)) {
        this.addNode(id, nodeState);
      }
      this.soundNodes[id].loop();
    }

    Object.keys(this.soundNodes).forEach((soundNodeKey) => {
      if (nodeStates[soundNodeKey] === undefined) {
        this.removeNode(soundNodeKey);
      }
    });
  }

  private tick() {
    const nodeStates = computeSoundNodeStates(useAppStore.getState().nodes);
    this.integrateNodeStates(nodeStates);
  }

  private updateFactor() {
    const pos = timeToPos(this.context.currentTime);
    useAppStore.getState().setIndicatorPos(pos);
  }

  public start() {
    const setUpdateInterval = startLooping(
      calcLoopLength(useAppStore.getState().bpm),
      this.tick.bind(this),
    );
    useAppStore.subscribe(
      (state, prevState) =>
        state.bpm !== prevState.bpm &&
        setUpdateInterval(calcLoopLength(state.bpm)),
    );

    setInterval(this.updateFactor.bind(this), 10);
  }
}
