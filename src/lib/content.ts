export const getCommon = async (locale: string) => {
  const common = await import("../_content/genshin/data/common.json");
  return (common as any)[locale];
};
