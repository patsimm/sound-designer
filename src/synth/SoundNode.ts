import { SoundNodeState } from "./SoundNodeState.ts";
import { beatEnd, beatStart } from "./bpm.ts";
import * as Note from "@tonaljs/note";

export class SoundNode {
  id: string;
  private _state: SoundNodeState;
  context: AudioContext;
  oscillator: OscillatorNode;
  gain: GainNode;

  constructor(id: string, state: SoundNodeState, context: AudioContext) {
    this.id = id;
    this.context = context;
    this.oscillator = context.createOscillator();
    this.oscillator.type = "sine";
    this.oscillator.start(context.currentTime);
    this.gain = context.createGain();
    this.gain.gain.value = 0;
    this.oscillator.connect(this.gain);

    this.gain.connect(context.destination);

    this._state = state;
    this.schedule(context.currentTime);
  }

  schedule(time: number) {
    const startTime = time + this._state.time;
    const endTime = startTime + this._state.length;
    const freq = Note.freq(this._state.note);
    if (freq === null) {
      console.error(`Cannot determine frequency for note ${this._state.note}`);
      return;
    }
    this.oscillator.frequency.linearRampToValueAtTime(freq, startTime);
    this.gain.gain.setValueAtTime(0, startTime - 0.001);
    this.gain.gain.linearRampToValueAtTime(0.4, startTime + 0.001);
    this.gain.gain.setValueAtTime(0.4, endTime - 0.001);
    this.gain.gain.linearRampToValueAtTime(0, endTime);
  }

  cancelScheduled(time: number) {
    this.oscillator.frequency.cancelScheduledValues(time);
    this.gain.gain.cancelScheduledValues(time);
  }

  updateState(state: SoundNodeState) {
    this._state = state;
    const currentBeatStart = beatStart(this.context.currentTime);
    const nextBeatStart = beatEnd(this.context.currentTime);
    this.cancelScheduled(currentBeatStart);
    this.schedule(currentBeatStart);
    this.schedule(nextBeatStart);
  }

  loop() {
    const nextBeatStart = beatEnd(this.context.currentTime);
    this.cancelScheduled(nextBeatStart);
    this.schedule(nextBeatStart);
  }
}
