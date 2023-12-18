type Options = {
  resource: string;
  language?: string;
  filter?: {
    id: string;
  };
  revalidate?: number;
};
export async function getGenshinData<T>(options: Options) {
  const baseUrl = `${process.env.NEXT_PUBLIC_IMGS_CDN}/genshin/gamedata/${
    options.language ?? "english"
  }/${options.resource}/${options.filter ? options.filter.id : "list"}.json`;
  // console.log(baseUrl)
  const res = await fetch(baseUrl, {
    method: "GET",
    next: {
      revalidate: options.revalidate ? options.revalidate : 60 * 60 * 24,
    },
  });

  return res.json() as Promise<T>;
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
