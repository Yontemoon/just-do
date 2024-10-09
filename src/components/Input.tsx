import clsx from "clsx";
import { InputHTMLAttributes } from "react";

type PropTypes = InputHTMLAttributes<HTMLInputElement> & {
  className?: string;
};

const Input = ({ className, ...props }: PropTypes) => {
  return (
    <input
      className={clsx(
        className,
        "pb-1 border-t-0 border-l-0  pt-3 tracking-tight px-3 bg-gray-300 w-full outline-none text-primary autofill:bg-gray-300 focus:bg-gray-300"
      )}
      {...props}
    />
  );
};

export default Input;
