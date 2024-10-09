import {
  createContext,
  useCallback,
  useState,
  useEffect,
  useMemo,
} from "react";
import PocketBase, {
  AuthModel,
  RecordAuthResponse,
  RecordModel,
} from "pocketbase";
import { useInterval } from "usehooks-ts";
import { jwtDecode, JwtPayload } from "jwt-decode";
import ms from "ms";

export type TAuthContext = {
  register: (email: string, password: string) => Promise<RecordModel>;
  login: (
    email: string,
    password: string
  ) => Promise<RecordAuthResponse<RecordModel>>;
  logout: () => void;
  user: AuthModel;
  token: string | null;
  pb: PocketBase;
};

export const AuthContext = createContext<TAuthContext | null>(null);
const fiveMinutesInMs = ms("5 minutes");
const twoMinutesInMs = ms("2 minutes");

export const PocketProvider = ({ children }: { children: React.ReactNode }) => {
  // const navigate = useNavigate({ from: "/" });
  const pb = useMemo(
    () => new PocketBase(import.meta.env.VITE_PB_BASE_URL),
    []
  );

  const [token, setToken] = useState<string | null>(pb.authStore.token);
  const [user, setUser] = useState<AuthModel | null>(pb.authStore.model);

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
    const authData = await pb
      .collection("users")
      .authWithPassword(email, password);
    if (authData) {
      setUser(authData);
      setToken(authData.token);
    }
    return authData;
  };

  const logout = () => {
    pb.authStore.clear();
  };

  const refreshSession = useCallback(async () => {
    if (!pb.authStore.isValid) return;
    if (token) {
      const decoded = jwtDecode<JwtPayload>(token);
      const tokenExpiration = decoded.exp as number;
      const expirationWithBuffer = (tokenExpiration + fiveMinutesInMs) / 1000;
      if (tokenExpiration < expirationWithBuffer) {
        await pb.collection("users").authRefresh();
      }
    }
  }, [token, pb]);

  useInterval(refreshSession, token ? twoMinutesInMs : null);
  return (
    <AuthContext.Provider value={{ register, login, logout, user, token, pb }}>
      {children}
    </AuthContext.Provider>
  );
};
