export function getUniqueListBy<T extends Record<string, any>>(
  arr: T[],
  key: string
) {
  return [...new Map(arr.map((item) => [item[key], item])).values()];
}
