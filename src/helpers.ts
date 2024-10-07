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
