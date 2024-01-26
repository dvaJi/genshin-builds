"use client";

import { uploadFile } from "@lib/upload-file";
import axios from "axios";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
} from "react";
import { useDropzone, type DropzoneOptions } from "react-dropzone";

const DROPZONE_OPTIONS: DropzoneOptions = {
  accept: {
    "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"],
  },
  noClick: true,
  maxFiles: 1,
  maxSize: 11000000,
};

const imageTypeRegex = /image\/(png|gif|jpg|jpeg)/gm;

export const useUpload = (game: string) => {
  const [formatImage, setFormatImage] = useState<File | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [progressStatus, setProgressStatus] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (!acceptedFiles.length) return;
    setFormatImage(acceptedFiles[0]);
  }, []);

  const reset = useCallback(() => {
    setFormatImage(null);
    setImage(null);
    setIsFetching(false);
    setIsSuccess(false);
    setProgressStatus(0);
    setError(null);
  }, []);

  const { getRootProps, getInputProps, fileRejections, isDragActive } =
    useDropzone({ ...DROPZONE_OPTIONS, onDrop });

  const onChangeFile = (e: ChangeEvent<HTMLInputElement>): void => {
    const files = e.target?.files!;

    const file = files?.[0];
    if (!file?.type.match(imageTypeRegex)) return;

    setFormatImage(file);
  };

  useEffect(() => {
    if (fileRejections.length) {
      fileRejections
        .map((el) => el.errors)
        .map((err) => {
          err.map((el) => {
            if (el.code.includes("file-invalid-type")) {
              setError("File type must be .png,.jpg,.jpeg,.gif");
              return;
            }
            if (el.code.includes("file-too-large")) {
              setError("File is larger than 10MB");
              return;
            }
          });
        });
    }
  }, [fileRejections]);

  useEffect(() => {
    (async () => {
      if (!formatImage) return;

      try {
        setIsFetching(true);
        const data = await uploadFile({
          game,
          data: formatImage,
          onUploadProgress(progress) {
            setProgressStatus(progress);
          },
        });

        if (data) {
          setFormatImage(null);
          setImage(data);
          setIsFetching(false);
          setIsSuccess(true);
        }
      } catch (err) {
        if (axios.isAxiosError<{ message: string }>(err)) {
          setError(err.response?.data.message ?? err.message);
        }
        if (err instanceof Error) {
          setError(err.message);
        }
        setFormatImage(null);
        setImage(null);
        setIsFetching(false);
        setIsSuccess(false);
      }
    })();
  }, [formatImage, game]);

  return {
    reset,
    isFetching,
    isDragActive,
    isSuccess,
    image,
    progressStatus,
    inputRef,
    error,
    onChangeFile,
    getRootProps,
    getInputProps,
  };
};
