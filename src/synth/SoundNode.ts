import * as Chord from "@tonaljs/chord";
import * as Note from "@tonaljs/note";

import { beatEnd, beatStart } from "./bpm.ts";
import { SoundNodeState } from "./SoundNodeState.ts";

export class SoundNode {
  id: string;
  context: AudioContext;
  oscillators: OscillatorNode[];
  gain: GainNode;

  #state: SoundNodeState;

  constructor(
    id: string,
    state: SoundNodeState,
    context: AudioContext,
    offset: number,
  ) {
    this.id = id;
    this.context = context;

    this.gain = this.context.createGain();
    this.gain.gain.value = 0;

    this.oscillators = [];

    this.gain.connect(this.context.destination);

    this.#state = state;
    this.setupState(offset);
  }

  public dispose() {
    this.gain.disconnect(this.context.destination);
    this.oscillators.forEach((oscillator) => {
      oscillator.stop();
      oscillator.disconnect(this.gain);
    });
  }

  private createOscillator() {
    const oscillator = this.context.createOscillator();
    oscillator.type = "sawtooth";
    oscillator.start(this.context.currentTime);

    oscillator.connect(this.gain);
    return oscillator;
  }

  public updateState(state: SoundNodeState, offset: number) {
    this.#state = state;
    this.setupState(offset);
  }

  schedule(time: number) {
    const startTime = time + this.#state.time;
    const endTime = startTime + this.#state.length;

    const degrees = Chord.degrees("sus", this.#state.note);
    this.oscillators.forEach((oscillator, index) => {
      const freq = Note.freq(degrees(index + 1));
      if (freq === null) {
        console.error(
          `Cannot determine frequency for note ${this.#state.note}`,
        );
        return;
      }
      oscillator.frequency.linearRampToValueAtTime(freq, startTime);
    });
    this.gain.gain.setValueAtTime(0, Math.max(startTime - 0.001, 0));
    this.gain.gain.linearRampToValueAtTime(0.4, startTime + 0.001);
    this.gain.gain.setValueAtTime(0.4, Math.max(endTime - 0.001, 0));
    this.gain.gain.linearRampToValueAtTime(0, endTime);
  }

  cancelScheduled(time: number) {
    this.oscillators.forEach((oscillator) =>
      oscillator.frequency.cancelScheduledValues(time),
    );
    this.gain.gain.cancelScheduledValues(time);
  }

  public async stop() {
    this.cancelScheduled(this.context.currentTime);
    this.gain.gain.linearRampToValueAtTime(0, this.context.currentTime + 0.001);
    await new Promise((resolve) => setTimeout(resolve, 10));
  }

  public setupState(offset: number) {
    if (this.oscillators.length > this.#state.chordNotes) {
      this.oscillators.slice(this.#state.chordNotes).forEach((oscillator) => {
        oscillator.stop();
        oscillator.disconnect(this.gain);
      });
      this.oscillators = this.oscillators.slice(0, this.#state.chordNotes);
    }

    if (this.oscillators.length < this.#state.chordNotes) {
      for (let i = this.oscillators.length; i < this.#state.chordNotes; i++) {
        this.oscillators = [...this.oscillators, this.createOscillator()];
      }
    }

    const currentBeatStart = beatStart(this.context.currentTime) + offset;
    const nextBeatStart = beatEnd(this.context.currentTime) + offset;

    this.cancelScheduled(currentBeatStart);
    this.schedule(currentBeatStart);
    this.schedule(nextBeatStart);
  }

  loop(offset: number) {
    const nextBeatStart = beatEnd(this.context.currentTime) + offset;
    this.cancelScheduled(nextBeatStart);
    this.schedule(nextBeatStart);
  }
}
