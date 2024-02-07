"use client";

import _QRCode from "qrcode";
import { useEffect, useRef, useState } from "react";

interface QRCodeProps {
  value: string;
  size?: number;
}

function QRCode({ value, size = 128 }: QRCodeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isQRGenerated, setQRGenerated] = useState(false);

  useEffect(() => {
    if (canvasRef.current) {
      _QRCode.toCanvas(
        canvasRef.current,
        value,
        {
          width: size,
          errorCorrectionLevel: "H",
        },
        (error) => {
          if (!error) {
            setQRGenerated(true);
          }
        }
      );
    }
  }, [value, size]);

  return (
    <>
      {!isQRGenerated && (
        <div className="h-32 w-32 animate-pulse rounded bg-vulcan-600"></div>
      )}
      <canvas
        className={`rounded ${isQRGenerated ? "" : "hidden"}`}
        ref={canvasRef}
      />
    </>
  );
}

export default QRCode;
