type Props = {
  url: string;
  height?: number;
  width?: number;
  theme?: string;
};

export default function XEmbed({ url, height, width, theme }: Props) {
  const encodedUrl = encodeURIComponent(url);

  return (
    <iframe
      frameBorder={0}
      height={height || 250}
      width={width || 550}
      src={`https://twitframe.com/show?url=${encodedUrl}&theme=${theme || "dark"}`}
    />
  );
}
