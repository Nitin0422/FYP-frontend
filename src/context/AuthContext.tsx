import { createContext, useContext } from "react";

export interface AuthContextType {
  loggedIn: boolean | null;
  role: string | null;
  setLoggedIn: (loggedIn: boolean) => void;
  setRole: (role:string) => void;
  // setAuth: (value: { loggedIn: boolean; role: string }) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};

export default useAuth;
