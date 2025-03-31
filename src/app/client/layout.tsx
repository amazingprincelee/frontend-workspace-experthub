"use client";

import { ReactNode, useState, useEffect } from "react";
import {
  FaTachometerAlt,
  FaUsers,
  FaUserTie,
  FaBuilding,
  FaPlusSquare,
  FaTimes,
  FaLifeRing,
  FaBriefcase,
} from "react-icons/fa";
import { AiFillHome } from "react-icons/ai";
import { IoMdAddCircle } from "react-icons/io";
import Link from "next/link";
import { IoExitOutline } from "react-icons/io5";

interface ClientLayoutProps {
  children: ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
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

  return (
    <div className="flex h-screen bg-gray-100 mt-20">
      {/* Sidebar (Visible on md+ screens) */}
      <aside
        className={`fixed md:relative h-full w-64 bg-white shadow-md transition-transform duration-300 md:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-64"
        }`}
      >
        <div className="p-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Provider Panel</h1>
          {/* Close Button (Mobile Only) */}
          <button className="md:hidden text-gray-800" onClick={closeSidebar}>
          <FaTimes size={20} />
          </button>
        </div>
        <nav className="mt-4">
          <ul className="space-y-2">
            <li className="p-4 hover:bg-gray-200">
              <Link href="/client/dashboard" className="flex items-center" onClick={closeSidebar}>
                <FaTachometerAlt className="mr-2 text-gray-600" />
                <span>Dashboard</span>
              </Link>
            </li>
            <li className="p-4 hover:bg-gray-200">
              <Link href="/client/experthub" className="flex items-center" onClick={closeSidebar}>
                <FaBuilding className="mr-2 text-gray-600" />
                <span>ExpertHub Workspaces</span>
              </Link>
            </li>
            <li className="p-4 hover:bg-gray-200">
              <Link href="/client/provider" className="flex items-center" onClick={closeSidebar}>
                <FaUserTie className="mr-2 text-gray-600" />
                <span>Provider Workspaces</span>
              </Link>
            </li>
            <li className="p-4 hover:bg-gray-200">
              <Link href="/client/subscriptions" className="flex items-center" onClick={closeSidebar}>
                <FaBriefcase className="mr-2 text-gray-600" />
                <span>My Subscription</span>
              </Link>
            </li>
            <li className="p-4 hover:bg-gray-200">
              <Link href="/client/wallet" className="flex items-center" onClick={closeSidebar}>
                <FaPlusSquare className="mr-2 text-gray-600" />
                <span>Wallet</span>
              </Link>
            </li>
            <li className="p-4 hover:bg-gray-200">
              <Link href="/client/support" className="flex items-center" onClick={closeSidebar}>
                <FaLifeRing className="mr-2 text-gray-600" />
                <span>Support</span>
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
            <IoExitOutline size={54} />
          </button>
        </div>

        <main className="flex-1 p-6 overflow-y-auto">{children}</main>

        {/* Bottom Navigation Bar (Mobile Only) */}
        {isMobile && (
          <nav className="fixed bottom-0 left-0 w-full bg-white shadow-md p-2 flex justify-around items-center border-t">
            <Link href="/client/dashboard" className="flex flex-col items-center">
              <AiFillHome size={24} className="text-gray-600" />
              <span className="text-xs">Home</span>
            </Link>
            <Link href="/client/experthub" className="flex flex-col items-center">
              <FaBuilding size={24} className="text-gray-600" />
              <span className="text-xs">ExpertHub</span>
            </Link>
            <Link href="/client/provider" className="flex flex-col items-center">
              <FaUserTie size={24} className="text-gray-600" />
              <span className="text-xs">Providers</span>
            </Link>
            <Link href="/client/wallet" className="flex flex-col items-center">
              <FaPlusSquare size={24} className="text-gray-600" />
              <span className="text-xs">Wallet</span>
            </Link>
            
          </nav>
        )}
      </div>
    </div>
  );
}
