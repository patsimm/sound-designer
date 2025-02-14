import { useAppStore } from "../App.store.ts";
import { debounce } from "../helpers.ts";
import { calcLoopLength, timeToPos } from "./bpm.ts";
import { startLooping } from "./Looper.ts";
import { SoundNode } from "./SoundNode.ts";
import {
  computeSoundNodeStates,
  SoundNodeState,
  subscribeToNodeState,
} from "./SoundNodeState.ts";

export default class Player {
  private readonly soundNodes: { [key: string]: SoundNode } = {};
  private readonly context: AudioContext;

  #offset = 0;

  #state: "playing" | "stopped" = "stopped";
  public get state() {
    return this.#state;
  }

  public constructor() {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    if ((navigator as any).audioSession) {
      (navigator as any).audioSession.type = "playback";
    }
    /* eslint-enable @typescript-eslint/no-explicit-any */

    this.context = new AudioContext();
    this.context.suspend();
    this.integrateNodeStates(
      computeSoundNodeStates(useAppStore.getInitialState().nodes),
    );
  }

  public async play() {
    await this.context.resume();
    this.#state = "playing";
  }

  public async stop() {
    await Promise.all(
      Object.values(this.soundNodes).map(
        async (soundNode) => await soundNode.stop(),
      ),
    );
    await this.context.suspend();
    this.#offset =
      this.context.currentTime % calcLoopLength(useAppStore.getState().bpm);
    Object.values(this.soundNodes).forEach((soundNode) => {
      soundNode.setupState(this.#offset);
    });
    this.#state = "stopped";
  }

  private removeNode(nodeId: string) {
    this.soundNodes[nodeId]?.dispose();
    delete this.soundNodes[nodeId];
  }

  private addNode(nodeId: string, nodeState: SoundNodeState) {
    this.soundNodes[nodeId] = new SoundNode(
      nodeId,
      nodeState,
      this.context,
      this.#offset,
    );
    subscribeToNodeState(
      nodeId,
      debounce((nodeState) => {
        if (nodeState === undefined) {
          this.removeNode(nodeId);
          return;
        }
        this.soundNodes[nodeId].updateState(nodeState, this.#offset);
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
      this.soundNodes[id].loop(this.#offset);
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
    const pos = timeToPos(this.context.currentTime - this.#offset);
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
