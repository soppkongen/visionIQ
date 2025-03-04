import React from "react";
import { AuthProvider } from "../utils/AuthContext";

interface AuthProviderWrapperProps {
  children: React.ReactNode;
}

export const AuthProviderWrapper: React.FC<AuthProviderWrapperProps> = ({ children }) => {
  return <AuthProvider>{children}</AuthProvider>;
};
