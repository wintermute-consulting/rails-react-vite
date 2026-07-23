import { createContext, useContext, useEffect, useState } from "react";
import { api } from "~/lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/current_user")
      .then((data) => setUser(data.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const signIn = async (email, password) => {
    const data = await api.post("/users/sign_in", {
      user: { email, password },
    });
    setUser(data.user);
    return data.user;
  };

  const signUp = async (email, password, passwordConfirmation) => {
    const data = await api.post("/users", {
      user: {
        email,
        password,
        password_confirmation: passwordConfirmation,
      },
    });
    setUser(data.user);
    return data.user;
  };

  const signOut = async () => {
    await api.delete("/users/sign_out");
    setUser(null);
  };

  const value = { user, loading, signIn, signUp, signOut };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
