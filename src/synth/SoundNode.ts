import { SoundNodeState } from "./SoundNodeState.ts";
import { beatEnd, beatStart } from "./bpm.ts";
import * as Chord from "@tonaljs/chord";
import * as Note from "@tonaljs/note";

export class SoundNode {
  id: string;
  context: AudioContext;
  oscillators: OscillatorNode[];
  gain: GainNode;

  #state: SoundNodeState;
  get state() {
    return this.#state;
  }
  set state(state: SoundNodeState) {
    this.#state = state;
    this.setupState();
  }

  constructor(id: string, state: SoundNodeState, context: AudioContext) {
    this.id = id;
    this.context = context;

    this.gain = context.createGain();
    this.gain.gain.value = 0;

    this.oscillators = [];

    this.gain.connect(context.destination);

    this.#state = state;
    this.setupState();
  }

  private createOscillator() {
    const oscillator = this.context.createOscillator();
    oscillator.type = "sawtooth";
    oscillator.start(this.context.currentTime);

    oscillator.connect(this.gain);
    return oscillator;
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
    this.gain.gain.setValueAtTime(0, startTime - 0.001);
    this.gain.gain.linearRampToValueAtTime(0.4, startTime + 0.001);
    this.gain.gain.setValueAtTime(0.4, endTime - 0.001);
    this.gain.gain.linearRampToValueAtTime(0, endTime);
  }

  cancelScheduled(time: number) {
    this.oscillators.forEach((oscillator) =>
      oscillator.frequency.cancelScheduledValues(time),
    );
    this.gain.gain.cancelScheduledValues(time);
  }

  private setupState() {
    if (this.oscillators.length > this.#state.chordNotes) {
      this.oscillators.slice(this.#state.chordNotes).forEach((oscillator) => {
        oscillator.stop();
      });
      this.oscillators = this.oscillators.slice(0, this.#state.chordNotes);
    }

    if (this.oscillators.length < this.#state.chordNotes) {
      for (let i = this.oscillators.length; i < this.#state.chordNotes; i++) {
        this.oscillators = [...this.oscillators, this.createOscillator()];
      }
    }

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
