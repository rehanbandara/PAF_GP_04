import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import authService from "../services/authService";

// Create context
const AuthContext = createContext();

// Hook to use auth
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

// Provider
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Initialize auth on app load
   */
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedUser = localStorage.getItem("user");
        const storedToken = localStorage.getItem("token");

        if (storedUser && storedToken) {
          // ✅ Validate token before trusting it
          const isValid = authService.isTokenValid();

          if (isValid) {
            setUser(JSON.parse(storedUser));
            setToken(storedToken);
            setIsAuthenticated(true);
          } else {
            // ❌ Expired token → clear storage
            authService.clearAuthData();
          }
        }
      } catch (error) {
        console.error("Auth init error:", error);
        authService.clearAuthData();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  /**
   * Login
   */
  const login = useCallback(async (credentials) => {
    try {
      setIsLoading(true);

      const response = await authService.login(credentials);

      if (!response.success) {
        return { success: false, message: response.message };
      }

      // ✅ Store in state
      setUser(response.user);
      setToken(response.token);
      setIsAuthenticated(true);

      // ✅ Persist
      authService.storeAuthData(response.user, response.token);

      return { success: true };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, message: "Login failed" };
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Register
   */
  const register = useCallback(async (userData) => {
    try {
      setIsLoading(true);

      const response = await authService.register(userData);

      if (!response.success) {
        return { success: false, message: response.message };
      }

      setUser(response.user);
      setToken(response.token);
      setIsAuthenticated(true);

      authService.storeAuthData(response.user, response.token);

      return { success: true };
    } catch (error) {
      console.error("Register error:", error);
      return { success: false, message: "Registration failed" };
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Logout
   */
  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      setToken(null);
      setIsAuthenticated(false);

      authService.clearAuthData();
    }
  }, []);

  /**
   * Update user locally
   */
  const updateUser = useCallback((newData) => {
    setUser((prev) => {
      const updated = { ...prev, ...newData };
      localStorage.setItem("user", JSON.stringify(updated));
      return updated;
    });
  }, []);

  /**
   * Check authentication status
   */
  const checkAuth = useCallback(() => {
    return isAuthenticated;
  }, [isAuthenticated]);

  /**
   * Get token (useful for debugging or manual calls)
   */
  const getToken = useCallback(() => {
    return token;
  }, [token]);

  /**
   * Context value
   */
  const value = {
    user,
    token,
    isAuthenticated,
    isLoading,

    login,
    register,
    logout,

    updateUser,
    checkAuth,
    getToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;