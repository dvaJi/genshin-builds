type Options = {
  resource: string;
  language?: string;
  select?: string[];
  filter?: {
    id: string;
  };
  revalidate?: number;
};
export async function getGenshinData<T>(options: Options) {
  const res = await fetch(process.env.GENSHIN_API_URL, {
    method: "POST",
    body: JSON.stringify(options),
    next: {
      revalidate: options.revalidate ? options.revalidate : 60 * 60 * 24,
    },
  });

  return res.json() as Promise<T>;
}

export async function getHSRData<T>(options: Options) {
  const res = await fetch(process.env.HSR_API_URL, {
    method: "POST",
    body: JSON.stringify(options),
    next: {
      revalidate: options.revalidate ? options.revalidate : 60 * 60 * 24,
    },
  });

  return res.json() as Promise<T>;
}
