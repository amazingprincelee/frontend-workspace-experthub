"use client";

import { ReactNode, useState, useEffect } from "react";
import {
  FaTachometerAlt,
  FaUsers,
  FaBuilding,
  FaPlusSquare,
  FaTimes,
  FaCalendar,
  FaUserFriends,
} from "react-icons/fa";
import { TiMessages } from "react-icons/ti";
import { AiFillHome } from "react-icons/ai";
import { IoMdAddCircle } from "react-icons/io";
import Link from "next/link";
import { IoExitOutline } from "react-icons/io5";

interface ProviderLayoutProps {
  children: ReactNode;
}

export default function ProviderLayout({ children }: ProviderLayoutProps) {
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
              <Link href="/provider/dashboard" className="flex items-center" onClick={closeSidebar}>
                <FaTachometerAlt className="mr-2 text-gray-600" />
                <span>Dashboard</span>
              </Link>
            </li>
            <li className="p-4 hover:bg-gray-200">
              <Link href="/provider/workspaces" className="flex items-center" onClick={closeSidebar}>
                <FaBuilding className="mr-2 text-gray-600" />
                <span>Workspace</span>
              </Link>
            </li>
            <li className="p-4 hover:bg-gray-200">
              <Link href="/provider/clients" className="flex items-center" onClick={closeSidebar}>
                <FaUsers className="mr-2 text-gray-600" />
                <span>Clients</span>
              </Link>
            </li>
            <li className="p-4 hover:bg-gray-200">
              <Link href="/provider/team" className="flex items-center" onClick={closeSidebar}>
                <FaUserFriends className="mr-2 text-gray-600" />
                <span>Team</span>
              </Link>
            </li>
            <li className="p-4 hover:bg-gray-200">
              <Link href="/provider/calendar" className="flex items-center" onClick={closeSidebar}>
                <FaCalendar className="mr-2 text-gray-600" />
                <span>Calendar</span>
              </Link>
            </li>
            <li className="p-4 hover:bg-gray-200">
              <Link href="/provider/support" className="flex items-center" onClick={closeSidebar}>
                <TiMessages className="mr-2 text-gray-600" />
                <span>Message</span>
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
            <Link href="/provider/dashboard" className="flex flex-col items-center">
              <AiFillHome size={24} className="text-gray-600" />
              <span className="text-xs">Home</span>
            </Link>
            <Link href="/provider/createspace" className="flex flex-col items-center">
              <IoMdAddCircle size={24} className="text-gray-600" />
              <span className="text-xs">Create</span>
            </Link>
            <Link href="/provider/clients" className="flex flex-col items-center">
              <FaUsers size={24} className="text-gray-600" />
              <span className="text-xs">Client</span>
            </Link>
            <Link href="/provider/team" className="flex flex-col items-center">
              <FaUserFriends size={24} className="text-gray-600" />
              <span className="text-xs">Team</span>
            </Link>
            <Link href="/provider/calendar" className="flex flex-col items-center">
              <FaCalendar size={24} className="text-gray-600" />
              <span className="text-xs">Calendar</span>
            </Link>
            <Link href="/provider/wallet" className="flex flex-col items-center">
              <FaPlusSquare size={24} className="text-gray-600" />
              <span className="text-xs">Wallet</span>
            </Link>
            
          </nav>
        )}
      </div>
    </div>
  );
}
