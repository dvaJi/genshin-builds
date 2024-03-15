import { GENSHIN_API_URL, HSR_API_URL } from "./constants";

type APIOptions = {
  resource: string;
  language?: string;
  select?: string[];
  asMap?: boolean;
  filter?: {
    id: string;
  };
  revalidate?: number;
};

export async function getGenshinData<T>(options: APIOptions): Promise<T> {
  return getData<T>(GENSHIN_API_URL, options, ["genshin-data"]);
}

export async function getHSRData<T>(options: APIOptions) {
  return getData<T>(HSR_API_URL, options, ["hsr-data"]);
}

async function getData<T>(url: string, options: APIOptions, tags: string[]) {
  const res = await fetch(url, {
    method: "POST",
    body: JSON.stringify(options),
    next: {
      revalidate: options.revalidate ? options.revalidate : 60 * 60 * 24,
      tags,
    },
  });

  if (options.filter && res.status === 404) return null as T;

  if (options.asMap) {
    const data = await res.json();
    return data.reduce((acc: any, curr: any) => {
      acc[curr.id] = curr;
      return acc;
    }, {} as any) as T;
  }

  return res.json() as Promise<T>;
}
