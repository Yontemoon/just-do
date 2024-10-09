import { useContext } from "react";
import { AuthContext, TAuthContext } from "../context/AuthContext";

export const usePocket = () => useContext(AuthContext) as TAuthContext;
