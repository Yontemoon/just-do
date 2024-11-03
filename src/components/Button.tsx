import clsx from "clsx";
import React from "react";
import type { ComponentProps } from "react";

type PropTypes = ComponentProps<"button"> & {
  children: React.ReactNode;
  className?: string;
};
const Button = ({ children, className, ...props }: PropTypes) => {
  return (
    <button
      className={clsx(
        "inline-flex justify-center relative z-10 m-0 border-0 align-middle select-none px-5 py-3 hover:opacity-85 bg-black text-white",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
