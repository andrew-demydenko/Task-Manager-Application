import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router";
import { userService } from "@/services/userService";
import type { IUser } from "@/types/user";

interface AuthContextType {
  isAuthenticated?: boolean;
  login: (token: string) => void;
  logout: () => void;
  user: IUser | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth should be provided with AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>();
  const [user, setUser] = useState<IUser | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("accessToken");

        if (!token) {
          setIsAuthenticated(false);
          return;
        }

        const user = await userService.getCurrentUser();

        if (user) {
          setUser(user);
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          localStorage.removeItem("accessToken");
          navigate("/");
        }
      } catch (error) {
        console.error("Error:", error);
        setIsAuthenticated(false);
        localStorage.removeItem("accessToken");
        navigate("/");
      }
    };

    checkAuth();
  }, [navigate]);

  const login = (token: string) => {
    localStorage.setItem("accessToken", token);
    setIsAuthenticated(true);
    navigate("/projects");
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    setIsAuthenticated(false);
    navigate("/");
  };

  const value = {
    user,
    isAuthenticated,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
