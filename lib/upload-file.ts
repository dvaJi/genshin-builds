import axios from "axios";

type ImageResponse = {
  uploadUrl: string;
  imageUrl: string;
};

type UploadFileProps = {
  game: string;
  data: File;
  onUploadProgress: (progress: number) => void;
};

export const uploadFile = async ({
  game,
  data,
  onUploadProgress,
}: UploadFileProps): Promise<string> => {
  const { data: urlData } = await axios.post<ImageResponse>(
    "/api/blog/upload-url",
    {
      game,
      Key: data.name,
    }
  );

  if (!urlData) {
    throw new Error("Failed to get upload url");
  }

  await axios.put(urlData.uploadUrl, data, {
    headers: {
      "Content-Type": data.type,
    },
    onUploadProgress(progressEvent) {
      const percentCompleted = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total!
      );
      onUploadProgress(percentCompleted);
    },
  });

  return urlData.imageUrl;
};
