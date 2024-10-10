import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";

export const usePocket = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("usePocket must be inside the AuthProvider");
  }
  return context;
};
