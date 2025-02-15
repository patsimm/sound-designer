export function mapObjectValues<T, U>(
  obj: Record<string, T>,
  mapper: (val: T | undefined) => U,
) {
  return Object.keys(obj).reduce(
    (prev, curr) => ({
      ...prev,
      [curr]: mapper(obj[curr]),
    }),
    {} as Record<string, U>,
  );
}

export function zip<T>(a: T[][]) {
  if (a.some((step) => step.length != a[0].length))
    throw new RangeError("step arrays must be of equal length");
  return a[0].map((_, i) => a.map((_, j) => a[j][i]));
}

export function debounce<A extends unknown[]>(
  func: (...args: A) => void,
  timeout = 300,
) {
  let timer: number;
  return (...args: A) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func(...args);
    }, timeout);
  };
}

export function clamp(min: number, max: number, value: number) {
  return Math.min(Math.max(value, min), max);
}

export function lerp(a: number, b: number, alpha: number) {
  const alphaClamped = clamp(0, 1, alpha);
  return a + alphaClamped * (b - a);
}

export function lerpArray(a: number[], b: number[], alpha: number) {
  if (a.length != b.length)
    throw new RangeError("arrays must be of equal length");
  const alphaClamped = clamp(0, 1, alpha);
  return a.map((aVal, i) => lerp(aVal, b[i], alphaClamped));
}

export function lerpStep(steps: number[], alpha: number) {
  const alphaClamped = clamp(0, 1, alpha);
  const step = alphaClamped * (steps.length - 1);
  const stepIndex = clamp(0, steps.length - 1, Math.floor(step));
  const stepAlpha = step % 1;
  return lerp(
    steps[stepIndex],
    steps[clamp(0, steps.length - 1, stepIndex + 1)],
    stepAlpha,
  );
}

export function lerpStepArray(steps: number[][], alpha: number) {
  if (steps.some((step) => step.length != steps[0].length))
    throw new RangeError("step arrays must be of equal length");
  const alphaClamped = clamp(0, 1, alpha);

  return zip(steps).map((val) => lerpStep(val, alphaClamped));
}
