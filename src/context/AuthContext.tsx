import {
  createContext,
  useContext,
  useCallback,
  useState,
  useEffect,
  useMemo,
} from "react";
import PocketBase from "pocketbase";
import { useInterval } from "usehooks-ts";
import { jwtDecode } from "jwt-decode";
import ms from "ms";

export const AuthContext = createContext({});
const fiveMinutesInMs = ms("5 minutes");
const twoMinutesInMs = ms("2 minutes");

export const PocketProvider = ({ children }: { children: React.ReactNode }) => {
  const pb = useMemo(
    () => new PocketBase(import.meta.env.VITE_PB_BASE_URL),
    []
  );

  const [token, setToken] = useState(pb.authStore.token);
  const [user, setUser] = useState(pb.authStore.model);

  useEffect(() => {
    return pb.authStore.onChange((token, model) => {
      setToken(token);
      setUser(model);
    });
  }, [pb.authStore]);

  const register = async (email: string, password: string) => {
    return await pb
      .collection("users")
      .create({ email, password, passwordConfirm: password });
  };

  const login = async (email: string, password: string) => {
    return await pb.collection("users").authWithPassword(email, password);
  };

  const logout = () => {
    pb.authStore.clear();
  };

  const refreshSession = useCallback(async () => {
    if (!pb.authStore.isValid) return;
    const decoded = jwtDecode(token);
    const tokenExpiration = decoded.exp;
    const expirationWithBuffer = (decoded.exp + fiveMinutesInMs) / 1000;
    if (tokenExpiration < expirationWithBuffer) {
      await pb.collection("users").authRefresh();
    }
  }, [token]);

  useInterval(refreshSession, token ? twoMinutesInMs : null);
  return (
    <AuthContext.Provider value={{ register, login, logout, user, token, pb }}>
      {children}
    </AuthContext.Provider>
  );
};

export const usePocket = () => useContext(AuthContext);
