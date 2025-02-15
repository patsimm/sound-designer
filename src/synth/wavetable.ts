import Color, { ColorJson } from "color";

import { lerpStepArray } from "../helpers.ts";
import bass from "./wavetables/bass.json";
import saw from "./wavetables/saw.json";
import square from "./wavetables/square.json";
import triangle from "./wavetables/triangle.json";

// source: https://github.com/GoogleChromeLabs/web-audio-samples/blob/main/src/demos/wavetable-synth/wave-tables
const wavetables = [saw, square, bass, triangle];

export function colorToWavetable(colorJson: ColorJson) {
  const color = Color(colorJson);
  const hue = color.hue();

  const realArray = wavetables.map((wavetable) => wavetable.real);
  const imagArray = wavetables.map((wavetable) => wavetable.imag);

  const normalizedHue = hue / 360;

  return {
    real: lerpStepArray(realArray, normalizedHue),
    imag: lerpStepArray(imagArray, normalizedHue),
  };
}
