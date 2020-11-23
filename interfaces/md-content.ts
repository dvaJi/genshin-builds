export interface MDContent {
  content: string;
  title?: string;
  date?: string;
  slug?: string;
  author?: {
    name: string;
    picture: string;
  };
  ogImage?: {
    url: string;
  };
  coverImage?: string;
  [props: string]: string | undefined | Record<string, string>;
}
