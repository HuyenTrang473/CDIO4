import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useMemo,
  useCallback,
} from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [userRole, setUserRole] = useState(
    localStorage.getItem("userRole") || null,
  );
  const [userName, setUserName] = useState(
    localStorage.getItem("userName") || null,
  );
  const [userProfile, setUserProfile] = useState(() => {
    const storedProfile = localStorage.getItem("userProfile");
    return storedProfile ? JSON.parse(storedProfile) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedRole = localStorage.getItem("userRole");
    const storedName = localStorage.getItem("userName");
    const storedProfile = localStorage.getItem("userProfile");

    if (storedToken) {
      setToken(storedToken);
      setUserRole(storedRole);
      setUserName(storedName);
      if (storedProfile) {
        setUserProfile(JSON.parse(storedProfile));
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback((userData) => {
    const { access_token, name, role } = userData;
    const profile = {
      name,
      role,
      email: userData.email || "",
      theme: localStorage.getItem("userTheme") || "light",
      language: localStorage.getItem("userLanguage") || "vi",
    };
    localStorage.setItem("token", access_token);
    localStorage.setItem("userRole", role);
    localStorage.setItem("userName", name);
    localStorage.setItem("userProfile", JSON.stringify(profile));

    setToken(access_token);
    setUserRole(role);
    setUserName(name);
    setUserProfile(profile);
  }, []);

  const updateProfile = useCallback((nextProfile) => {
    setUserProfile((prev) => {
      const mergedProfile = { ...(prev || {}), ...nextProfile };
      if (mergedProfile.name) {
        localStorage.setItem("userName", mergedProfile.name);
        setUserName(mergedProfile.name);
      }
      if (mergedProfile.role) {
        localStorage.setItem("userRole", mergedProfile.role);
        setUserRole(mergedProfile.role);
      }
      if (mergedProfile.theme) {
        localStorage.setItem("userTheme", mergedProfile.theme);
      }
      if (mergedProfile.language) {
        localStorage.setItem("userLanguage", mergedProfile.language);
      }
      localStorage.setItem("userProfile", JSON.stringify(mergedProfile));
      return mergedProfile;
    });
  }, []);

  const logout = useCallback(() => {
    localStorage.clear();
    setToken(null);
    setUserRole(null);
    setUserName(null);
    setUserProfile(null);
  }, []);

  const authValue = useMemo(
    () => ({
      token,
      userRole,
      userName,
      userProfile,
      loading,
      isAuthenticated: !!token,
      login,
      updateProfile,
      logout,
    }),
    [
      token,
      userRole,
      userName,
      userProfile,
      loading,
      login,
      updateProfile,
      logout,
    ],
  );

  return (
    <AuthContext.Provider value={authValue}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
