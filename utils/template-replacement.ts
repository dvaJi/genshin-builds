export const templateReplacement = (
  template: string,
  data: Record<string, string>
) => {
  const pattern = /{\s*(\w+?)\s*}/g;
  return template.replace(pattern, (_, token) => data[token] || "");
};

/**
 * Replace #n[i]% in description based on params value
 *
 *
 * @param desc
 * @param params
 * @returns
 */
export function renderDescription(desc: string, params: number[]): string {
  let str = desc;
  for (let i = 0; i < params.length; i++) {
    const value = roundTwoDecimals(params[i]);
    str = str.replaceAll(`#${i + 1}[i]`, value.toString());
    str = str.replaceAll(`#${i + 1}[f1]%`, roundTwoDecimals(value * 100) + "%");
    str = str.replaceAll(`#${i + 1}[i]%`, roundTwoDecimals(value * 100) + "%");
  }

  return str;
}

function roundTwoDecimals(value: number) {
  return Math.round(value * 100) / 100;
}
