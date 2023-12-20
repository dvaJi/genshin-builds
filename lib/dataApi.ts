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

export async function getGenshinData<T>(options: APIOptions) {
  const res = await fetch(process.env.GENSHIN_API_URL, {
    method: "POST",
    body: JSON.stringify(options),
    next: {
      revalidate: options.revalidate ? options.revalidate : 60 * 60 * 24,
    },
  });

  if (options.asMap) {
    const data = await res.json();
    return data.reduce((acc: any, curr: any) => {
      acc[curr.id] = curr;
      return acc;
    }, {} as any) as T;
  }

  return res.json() as Promise<T>;
}

export async function getHSRData<T>(options: APIOptions) {
  const res = await fetch(process.env.HSR_API_URL, {
    method: "POST",
    body: JSON.stringify(options),
    next: {
      revalidate: options.revalidate ? options.revalidate : 60 * 60 * 24,
    },
  });

  return res.json() as Promise<T>;
}
