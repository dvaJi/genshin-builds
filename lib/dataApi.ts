import {
  GENSHIN_API_URL,
  HSR_API_URL,
  WW_API_URL,
  ZENLESS_API_URL,
} from "./constants";

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

export async function getWWData<T>(options: APIOptions) {
  try {
    return getData<T>(WW_API_URL, options, ["ww-data"]);
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function getZenlessData<T>(options: APIOptions) {
  try {
    return getData<T>(ZENLESS_API_URL, options, ["zenless-data"]);
  } catch (error) {
    console.log(error);
    return null;
  }
}

async function getData<T>(
  url: string,
  options: APIOptions,
  tags: string[]
): Promise<T> {
  const MAX_RETRIES = 3;
  let revalidate = options.revalidate ? options.revalidate : 86400;

  for (let i = 0; i < MAX_RETRIES; i++) {
    try {
      const res = await fetch(url, {
        method: "POST",
        body: JSON.stringify(options),
        next: {
          revalidate,
          tags,
        },
      });

      if (options.filter && res.status === 404) return null as T;

      if (!res.ok) {
        const text = await res.text();
        console.error("Error fetching data", res.statusText, text);
        throw new Error(res.statusText);
      }

      if (options.asMap) {
        const data = await res.json();
        return data.reduce((acc: any, curr: any) => {
          acc[curr.id] = curr;
          return acc;
        }, {} as any) as T;
      }

      return res.json() as Promise<T>;
    } catch (error) {
      console.log(i, error);
      if (
        error instanceof SyntaxError &&
        error.message.includes("Bad Gateway") &&
        i < MAX_RETRIES - 1
      ) {
        continue; // if it's a "Bad Gateway" error and we haven't reached the max retries, retry
      } else {
        console.error({ options });
        console.error("Error fetching data", error);
        throw error; // if it's a different error or we've reached the max retries, throw the error
      }
    }
  }

  console.error("Max retries reached", options);
  throw new Error("Max retries reached");
}
