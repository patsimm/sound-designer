import { SoundNodeState } from "./SoundNodeState.ts";
import { beatEnd, beatStart } from "./bpm.ts";

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
    const startTime = time + state.time;
    const endTime = startTime + state.length;
    this.oscillator.frequency.setValueAtTime(state.freq, startTime);
    this.gain.gain.setValueAtTime(0.4, startTime);
    this.gain.gain.setValueAtTime(0, endTime);
  }

  cancelScheduled(time: number) {
    this.oscillator.frequency.cancelScheduledValues(time);
    this.gain.gain.cancelScheduledValues(time);
  }

  updateState(state: SoundNodeState) {
    const currentBeatStart = beatStart(this.context.currentTime);
    const nextBeatStart = beatStart(this.context.currentTime);
    this.cancelScheduled(currentBeatStart);
    this.schedule(currentBeatStart, state);
    this.schedule(nextBeatStart, state);
  }

  nextState(state: SoundNodeState) {
    const nextBeatStart = beatEnd(this.context.currentTime);
    this.cancelScheduled(nextBeatStart);
    this.schedule(nextBeatStart, state);
  }
}
