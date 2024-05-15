"use client";

import Image, { ImageProps } from "next/image";
import React from "react";

import { getImg } from "@lib/imgUrl";

const imageLoader = ({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}) => {
  const url = getImg("wuthering", src, {
    width,
    quality,
  });
  return url;
};

const ForwardImage = React.forwardRef(
  (props: ImageProps, ref: React.Ref<HTMLImageElement>) => {
    // eslint-disable-next-line jsx-a11y/alt-text
    return <Image loader={imageLoader} ref={ref} {...props} />;
  }
);

export default ForwardImage;
