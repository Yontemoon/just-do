import { InputHTMLAttributes } from "react";
import clsx from "clsx";

type PropTypes = InputHTMLAttributes<HTMLInputElement> & {
  className?: string;
};

const Checkbox = ({ className, ...props }: PropTypes) => {
  return <input type="checkbox" className={clsx(className)} {...props} />;
};

export default Checkbox;
