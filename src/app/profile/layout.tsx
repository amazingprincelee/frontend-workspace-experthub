"use client";

import { ReactNode, useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { FaTachometerAlt, FaUsers, FaUserTie, FaBars, FaTimes } from "react-icons/fa";
import { AiFillHome } from "react-icons/ai";
import Link from "next/link";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function ProfileLayout({ children }: DashboardLayoutProps) {
  const { user } = useAuth();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check screen size to determine layout
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Toggle Sidebar
  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  // Close Sidebar when clicking outside
  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  // Determine the dashboard route based on the user's role
  const getDashboardRoute = () => {
    if (!user || !user.role) return "/dashboard";
    const role = user.role.toLowerCase();
    switch (role) {
      case "admin":
        return "/admin/dashboard";
      case "client":
        return "/client/dashboard";
      case "provider":
        return "/provider/dashboard";
      default:
        return "/dashboard";
    }
  };

  // Determine the panel title based on the user's role
  const getPanelTitle = () => {
    if (!user || !user.role) return "Dashboard";
    const role = user.role.toLowerCase();
    switch (role) {
      case "admin":
        return "Admin Panel";
      case "client":
        return "Client Panel";
      case "provider":
        return "Provider Panel";
      default:
        return "Dashboard";
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar (Visible on md+ screens) */}
      <aside
        className={`fixed md:relative h-full w-64 bg-white shadow-md transition-transform duration-300 md:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-64"
        }`}
      >
        <div className="p-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">{getPanelTitle()}</h1>
          {/* Close Button (Mobile Only) */}
          <button className="md:hidden text-gray-800" onClick={closeSidebar}>
            <FaTimes size={20} />
          </button>
        </div>
        <nav className="mt-4">
          <ul className="space-y-2">
            <li className="p-4 hover:bg-gray-200">
              <Link href={getDashboardRoute()} className="flex items-center" onClick={closeSidebar}>
                <FaTachometerAlt className="mr-2 text-gray-600" />
                <span>Dashboard</span>
              </Link>
            </li>   
          </ul>
        </nav>
      </aside>

      {/* Overlay Background (for mobile) */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 md:hidden"
          onClick={closeSidebar}
        ></div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen">
        {/* Toggle Button (Mobile Only) */}
        <div className="md:hidden p-4 flex justify-between">
          <button className="text-gray-800" onClick={toggleSidebar}>
            <FaBars size={24} />
          </button>
        </div>

        <main className="flex-1 p-6 overflow-y-auto">{children}</main>

        {/* Bottom Navigation Bar (Mobile Only) */}
        {isMobile && (
          <nav className="fixed bottom-0 left-0 w-full bg-white shadow-md p-2 flex justify-around items-center border-t">
            <Link href={getDashboardRoute()} className="flex flex-col items-center">
              <AiFillHome size={24} className="text-gray-600" />
              <span className="text-xs">Dashboard</span>
            </Link>
          </nav>
        )}
      </div>
    </div>
  );
}
