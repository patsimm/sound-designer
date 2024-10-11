export function mapObjectValues<T, U>(
  obj: { [key: string]: T },
  mapper: (val: T) => U,
) {
  return Object.keys(obj).reduce(
    (prev, curr) => ({
      ...prev,
      [curr]: mapper(obj[curr]),
    }),
    {} as { [key: string]: U },
  );
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
