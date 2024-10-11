import { SoundNodeState } from "./SoundNodeState.ts";
import { factor } from "./bpm.ts";

export class SoundNode {
  id: string;
  context: AudioContext;
  oscillator: OscillatorNode;
  gain: GainNode;

  constructor(id: string, context: AudioContext) {
    this.id = id;
    this.context = context;
    this.oscillator = context.createOscillator();
    this.oscillator.type = "sine";
    this.oscillator.start(context.currentTime);
    this.gain = context.createGain();
    this.gain.gain.value = 0;
    this.oscillator.connect(this.gain);

    this.gain.connect(context.destination);
  }

  schedule(time: number, state: SoundNodeState) {
    const startTime = time + state.pos;
    const endTime = startTime + factor / 8;
    this.oscillator.frequency.setValueAtTime(state.freq, startTime);
    this.gain.gain.setValueAtTime(0.4, startTime);
    this.gain.gain.setValueAtTime(0, endTime);
  }

  cancelScheduled(time: number) {
    this.oscillator.frequency.cancelScheduledValues(time);
    this.gain.gain.cancelScheduledValues(time);
  }

  nextState(state: SoundNodeState) {
    const nextBeatStart =
      Math.floor(this.context.currentTime / factor + 1) * factor;

    this.cancelScheduled(nextBeatStart);
    this.schedule(nextBeatStart, state);
  }

  updateState(state: SoundNodeState) {
    const currentBeatStart =
      Math.floor(this.context.currentTime / factor) * factor;

    this.cancelScheduled(currentBeatStart);
    this.schedule(currentBeatStart, state);
    this.schedule(currentBeatStart + factor, state);
  }
}
