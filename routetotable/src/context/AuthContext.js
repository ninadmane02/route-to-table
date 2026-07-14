import { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState({
    name: localStorage.getItem("name") || "",
    email: localStorage.getItem("email") || "",
    role: localStorage.getItem("role") || "",
    token: localStorage.getItem("token") || ""
  });

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};