import clsx from "clsx";

type PropTypes = {
  children: React.ReactNode;
  className?: string;
};
const Label = ({ children, className }: PropTypes) => {
  return (
    <label
      className={clsx(
        className,
        "flex w-full gap-x-1 align-middle select-none leading-4 text-gray-500 tracking-tight pt-3 pb-1 px-3"
      )}
    >
      {children}
    </label>
  );
};

export default Label;
