import { createContext, useState } from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [role, setRole] = useState(localStorage.getItem("role"));
  const [userId, setUserId] = useState(localStorage.getItem("userId"));
  const [username, setUsername] = useState(localStorage.getItem("username"));

  const login = (token, role, id, name) => {
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    localStorage.setItem("userId", id || "user-" + Date.now());
    localStorage.setItem("username", name || "User");
    setRole(role);
    setUserId(id || "user-" + Date.now());
    setUsername(name || "User");
  };

  const logout = () => {
    localStorage.clear();
    setRole(null);
    setUserId(null);
    setUsername(null);
  };

  return (
    <AuthContext.Provider value={{ role, userId, username, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
