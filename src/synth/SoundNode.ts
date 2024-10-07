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

  nextState(state: SoundNodeState) {
    const nextBeatStart = Math.ceil(this.context.currentTime / factor) * factor;
    this.oscillator.frequency.cancelScheduledValues(nextBeatStart);
    this.gain.gain.cancelScheduledValues(nextBeatStart);

    const startTime = nextBeatStart + state.pos;
    const endTime = startTime + factor / 8;
    this.oscillator.frequency.setValueAtTime(state.freq, startTime);
    this.gain.gain.setValueAtTime(0.4, startTime);
    this.gain.gain.setValueAtTime(0, endTime);
  }

  updateState(state: SoundNodeState) {
    const currentBeatStart =
      Math.floor(this.context.currentTime / factor) * factor;
    this.oscillator.frequency.cancelScheduledValues(currentBeatStart);
    this.gain.gain.cancelScheduledValues(currentBeatStart);

    const startTime = currentBeatStart + state.pos;
    const endTime = startTime + factor / 8;
    this.oscillator.frequency.setValueAtTime(state.freq, startTime);
    this.gain.gain.setValueAtTime(0.4, startTime);
    this.gain.gain.setValueAtTime(0, endTime);

    this.nextState(state);
  }
}
