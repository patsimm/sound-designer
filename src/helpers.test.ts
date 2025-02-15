import { describe, expect, test } from "vitest";

import {
  clamp,
  lerp,
  lerpArray,
  lerpStep,
  lerpStepArray,
  zip,
} from "./helpers.ts";

describe("clamp", () => {
  test("should return lower bound", () => {
    expect(clamp(0, 1, -1)).toBe(0);
  });

  test("should return upper bound", () => {
    expect(clamp(0, 1, 2)).toBe(1);
  });

  test("should return value", () => {
    expect(clamp(0, 1, 0.2)).toBe(0.2);
  });
});

describe("lerp", () => {
  test("should return center between", () => {
    expect(lerp(0, 2, 0.5)).toBe(1);
  });

  test("should return low value", () => {
    expect(lerp(0, 2, 0.125)).toBe(0.25);
  });
});

describe("lerpArray", () => {
  test("should return center between", () => {
    expect(lerpArray([0, -2], [2, 2], 0.5)).toEqual([1, 0]);
  });

  test("should return low value", () => {
    expect(lerpArray([0, -2], [2, 2], 0.125)).toEqual([0.25, -1.5]);
  });
});

describe("lerpStep", () => {
  test("should return upper boundary value", () => {
    expect(lerpStep([0, -2, 6], 1)).toEqual(6);
  });

  test("should return lower boundary value", () => {
    expect(lerpStep([0, -2, 6], 0)).toEqual(0);
  });

  test("should return center value", () => {
    expect(lerpStep([0, -2, 6], 0.5)).toEqual(-2);
  });

  test("should return lower value", () => {
    expect(lerpStep([0, 10, -50, -2, 6], 0.25)).toEqual(10);
  });

  test("should return value in between steps", () => {
    expect(lerpStep([0, 10, -50, -2, 6], 0.125)).toEqual(5);
  });

  test("should return other value in between steps", () => {
    expect(lerpStep([0, 10, -50, -2, 6], 0.8125)).toEqual(0);
  });
});

describe("flipArray", () => {
  test("should flip array", () => {
    expect(
      zip([
        [1, 2, 3, 4],
        [5, 6, 7, 8],
      ]),
    ).toEqual([
      [1, 5],
      [2, 6],
      [3, 7],
      [4, 8],
    ]);
  });
});

describe("lerpStepArray", () => {
  test("should return low value", () => {
    expect(
      lerpStepArray(
        [
          [1, 2, 3, 4],
          [5, 6, 7, 8],
        ],
        0.5,
      ),
    ).toEqual([3, 4, 5, 6]);
  });

  test("should return middle value", () => {
    expect(
      lerpStepArray(
        [
          [1, 2, 3, 4],
          [5, 6, 7, 8],
          [1, 2, 3, 4],
        ],
        0.5,
      ),
    ).toEqual([5, 6, 7, 8]);
  });
});
