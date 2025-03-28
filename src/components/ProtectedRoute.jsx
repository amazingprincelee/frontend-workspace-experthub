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

  // If not loading, check authentication immediately
  if (!user) {
    router.push("/auth/login");
    return <Loader />; // Keep Loader visible during redirect
  }

  // Treat any unknown role as "client"
  const userRole = user.role.toLowerCase();
  const effectiveRole = ["admin", "client", "provider"].includes(userRole)
    ? userRole
    : "client";

  // Log a warning for unknown roles (for debugging)
  if (userRole !== effectiveRole) {
    console.warn(
      `User role "${userRole}" is not recognized. Treating as "client".`
    );
  }

  // Check if the effective role is allowed
  if (!allowedRoles.includes(effectiveRole)) {
    router.push(`/${effectiveRole}/dashboard`); // Redirect to the effective role's dashboard
    return <Loader />; // Keep Loader visible during redirect
  }

  // If authenticated and effective role is allowed, render the children
  return children;
};

export default ProtectedRoute;