export const getURL = () => {
  let url =
    process?.env?.NEXT_PUBLIC_SITE_URL ?? // Set this to your site URL in production env.
    process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel.
    "http://localhost:3000/";
  // Make sure to include `https://` when not localhost.
  url = url.includes("http") ? url : `https://${url}`;
  // Make sure to including trailing `/`.
  url = url.charAt(url.length - 1) === "/" ? url : `${url}/`;
  return url;
};

export function getHsrId(id: string) {
  if (id.endsWith("_boy") || id.endsWith("_girl")) return id;
  if (id === "trailblazer_imaginary") return "trailblazer_harmony_boy";
  return id.startsWith("trailblazer") ? id + "_boy" : id;
}
