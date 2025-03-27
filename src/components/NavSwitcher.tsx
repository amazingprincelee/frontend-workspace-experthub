// components/NavbarSwitcher.tsx
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import HeaderNav from "./HeaderNav";
import AuthHeaderNav from "./AuthHeaderNav";

export default function NavbarSwitcher() {
  const { user, loading } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleToggle = () => {
    setIsMenuOpen((prev) => !prev);
  };

  useEffect(() => {
    console.log("NavbarSwitcher: user state changed:", user); // Debug log
  }, [user]);

  if (loading) {
    return <nav className="p-4 bg-gray-800 text-white">Loading...</nav>;
  }

  return user ? (
    <AuthHeaderNav setToggle={handleToggle} />
  ) : (
    <HeaderNav />
  );
}