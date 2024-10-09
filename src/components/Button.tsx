import clsx from "clsx";
import React, { ButtonHTMLAttributes } from "react";

type PropTypes = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
  className?: string;
};
const Button = ({ children, className, ...props }: PropTypes) => {
  return (
    <button
      className={clsx(
        "inline-flex justify-center relative z-10 m-0 border-0 align-middle select-none px-5 py-1",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
