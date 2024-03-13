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

  const res = await fetch(`${baseUrl}?game=${game}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.NEWS_API_KEY ?? "",
    },
    next: {
      tags: ["news-api"],
    },
  });

  return res.json() as Promise<News[]>;
}
