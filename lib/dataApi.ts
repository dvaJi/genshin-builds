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
  return getData<T>(process.env.GENSHIN_API_URL, options);
}

export async function getHSRData<T>(options: APIOptions) {
  return getData<T>(process.env.HSR_API_URL, options);
}

async function getData<T>(url: string, options: APIOptions) {
  const res = await fetch(url, {
    method: "POST",
    body: JSON.stringify(options),
    next: {
      revalidate: options.revalidate ? options.revalidate : 60 * 60 * 24,
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
