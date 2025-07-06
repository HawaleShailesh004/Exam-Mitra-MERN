import React, { createContext, useContext, useState, useEffect } from "react";
import API from "../utils/api"; // axios with baseURL + token

const UserContext = createContext();
export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true); // ✅ new

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setUser(null);
      setUserLoading(false); // ✅ done checking
      return;
    }

    API.get("/auth/me")
      .then((res) => {
        setUser(res.data.user);
      })
      .catch(() => {
        localStorage.removeItem("token");
        setUser(null);
      })
      .finally(() => {
        setUserLoading(false); // ✅ done either way
      });
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, userLoading }}>
      {children}
    </UserContext.Provider>
  );
};
