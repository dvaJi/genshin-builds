"use client";

import { useEffect, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";

type Props = {
  children: React.ReactNode;
  className?: string;
  closeClassName?: string;
  autoCloseDelay?: number; // in milliseconds
};

function Alert({ children, className, closeClassName, autoCloseDelay }: Props) {
  const [showAlert, setShowAlert] = useState(true);

  const handleClose = () => {
    setShowAlert(false);
  };

  useEffect(() => {
    if (autoCloseDelay) {
      const timer = setTimeout(handleClose, autoCloseDelay);
      return () => clearTimeout(timer); // cleanup on unmount
    }
  }, [autoCloseDelay]);

  return (
    <>
      {showAlert && (
        <div
          className={
            className
              ? className
              : "rounded-md bg-yellow-200 p-4 text-yellow-800"
          }
        >
          <span className="mr-2">{children}</span>
          <button
            className={
              closeClassName
                ? closeClassName
                : "text-yellow-800 hover:text-yellow-600"
            }
            onClick={handleClose}
          >
            <AiOutlineClose />
          </button>
        </div>
      )}
    </>
  );
}

export default Alert;
