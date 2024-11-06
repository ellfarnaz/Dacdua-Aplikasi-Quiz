// AuthContext.tsx
import React, { createContext, useState, useContext } from "react";

type AuthContextType = {
  isLoginInProgress: boolean;
  setIsLoginInProgress: (value: boolean) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoginInProgress, setIsLoginInProgress] = useState(false);

  return (
    <AuthContext.Provider value={{ isLoginInProgress, setIsLoginInProgress }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
