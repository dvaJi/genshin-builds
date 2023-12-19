import GenshinData, { Languages } from "genshin-data";

type Options = {
  resource: string;
  language?: string;
  asMap?: boolean;
  filter?: {
    id: string;
  };
  revalidate?: number;
};
export async function getGenshinData<T>(options: Options) {
  const giData = new GenshinData({
    language: (options.language as Languages) ?? "english",
  });
  // const asMap = options.asMap ? "map" : "list";
  const data = await (giData as any)[options.resource]();

  if (options.filter) {
    return data[options.filter.id] as T;
  }

  if (options.asMap) {
    return data.reduce((acc: any, curr: any) => {
      acc[curr.id] = curr;
      return acc;
    }, {}) as T;
  }

  return data as T;

  // const baseUrl = `${process.env.NEXT_PUBLIC_IMGS_CDN}/genshin/gamedata/${
  //   options.language ?? "english"
  // }/${options.resource}/${options.filter ? options.filter.id : asMap}.json`;
  // console.log(`[${baseUrl}]: START`);
  // const res = await fetch(baseUrl, {
  //   method: "GET",
  //   next: {
  //     revalidate: options.revalidate ? options.revalidate : 60 * 60 * 24,
  //   },
  // });

  // console.log(`[${baseUrl}]: END`);

  // return res.json() as Promise<T>;
}

type HsrOptions = {
  resource: string;
  language?: string;
  select?: string[];
  filter?: {
    id: string;
  };
  revalidate?: number;
};

export async function getHSRData<T>(options: HsrOptions) {
  const res = await fetch(process.env.HSR_API_URL, {
    method: "POST",
    body: JSON.stringify(options),
    next: {
      revalidate: options.revalidate ? options.revalidate : 60 * 60 * 24,
    },
  });

  return res.json() as Promise<T>;
}
