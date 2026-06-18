import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { getCurrentUser, getUsers, saveCurrentUser } from "../services/storage";
import type { User, UserRole } from "../types";

interface LoginResult {
  success: boolean;
  user?: User;
  message?: string;
}

interface AuthContextValue {
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => LoginResult;
  logout: () => void;
  hasRole: (roles: UserRole[]) => boolean;
}

const defaultAuthContext: AuthContextValue = {
  currentUser: null,
  isAuthenticated: false,
  login: () => ({ success: false, message: "Најавата не е достапна." }),
  logout: () => undefined,
  hasRole: () => false
};

export const AuthContext = createContext<AuthContextValue>(defaultAuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => getCurrentUser());

  useEffect(() => {
    const handleReset = () => {
      setCurrentUser(null);
    };

    window.addEventListener("lokalno:reset", handleReset);
    return () => window.removeEventListener("lokalno:reset", handleReset);
  }, []);

  const login = useCallback((email: string, password: string): LoginResult => {
    const normalizedEmail = email.trim().toLocaleLowerCase("mk-MK");
    const user = getUsers().find(
      (candidate) =>
        candidate.email.toLocaleLowerCase("mk-MK") === normalizedEmail &&
        candidate.password === password
    );

    if (!user) {
      return { success: false, message: "Погрешна е-пошта или лозинка." };
    }

    saveCurrentUser(user);
    setCurrentUser(user);
    return { success: true, user };
  }, []);

  const logout = useCallback(() => {
    saveCurrentUser(null);
    setCurrentUser(null);
  }, []);

  const hasRole = useCallback(
    (roles: UserRole[]) => Boolean(currentUser && roles.includes(currentUser.role)),
    [currentUser]
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      currentUser,
      isAuthenticated: Boolean(currentUser),
      login,
      logout,
      hasRole
    }),
    [currentUser, hasRole, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
