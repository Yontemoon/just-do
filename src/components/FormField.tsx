import React from "react";

type PropTypes = {
  children: React.ReactNode;
};

const FormField = ({ children }: PropTypes) => {
  return <div className="block w-full bg-gray-300">{children}</div>;
};

export default FormField;
