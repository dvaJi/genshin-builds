export function getUniqueListBy<T extends Record<string, any>>(
  arr: T[],
  key: string
) {
  const seen = new Set();
  return arr.filter((item) => {
    const k = item[key];
    return seen.has(k) ? false : seen.add(k);
  });
}
