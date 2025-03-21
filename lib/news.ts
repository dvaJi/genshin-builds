export interface News {
  title: string;
  excerpt: string;
  slug: string;
  date: Date;
  featuredImage: FeaturedImage;
  categories: string[];
  tags: string[];
  author: Author;
  url: string;
}

export interface Author {
  name: string;
  firstName: null;
  lastName: null;
  avatar: Avatar;
}

export interface Avatar {
  url: string;
}

export interface FeaturedImage {
  sourceUrl: string;
}

export async function getNews(game: string) {
  const baseUrl = process.env.NEWS_API_URL;

  try {
    const res = await fetch(`${baseUrl}?game=${game}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.NEWS_API_KEY ?? "",
      },
      next: {
        tags: ["news-api"],
        revalidate: 3600,
      },
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Error fetching news:", res.statusText, text);
      return [];
    }

    const data = (await res.json()) as News[];

    return data ?? [];
  } catch (error) {
    console.error("Error fetching news:", error);
    return [];
  }
}
