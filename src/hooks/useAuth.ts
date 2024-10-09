import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export const usePocket = () => useContext(AuthContext);
