// components/ProtectedRoute.jsx
"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Loader from "./Loader";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  // If still loading, show the Loader
  if (loading) {
    return <Loader />;
  }

  // If not loading, check authentication and role immediately
  if (!user) {
    router.push("/auth/login");
    return <Loader />; // Keep Loader visible during redirect
  }

  if (!allowedRoles.includes(user.role.toLowerCase())) {
    router.push("/client/dashboard");
    return <Loader />; // Keep Loader visible during redirect
  }

  // If authenticated and role is allowed, render the children
  return children;
};

export default ProtectedRoute;