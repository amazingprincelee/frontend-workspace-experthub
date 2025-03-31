"use client";

import { ReactNode, useState, useEffect } from "react";
import {
  FaTachometerAlt,
  FaUsers,
  FaUserTie,
  FaBuilding,
  FaCalendarCheck,
  FaPlusSquare,
  FaStar,
  FaTimes,
} from "react-icons/fa";
import { AiFillHome } from "react-icons/ai";
import { IoMdAddCircle } from "react-icons/io";
import Link from "next/link";
import { IoExitOutline } from "react-icons/io5";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
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
          <h1 className="text-2xl font-bold text-gray-800">Admin Panel</h1>
          {/* Close Button (Mobile Only) */}
          <button className="md:hidden text-gray-800" onClick={closeSidebar}>
          <FaTimes size={20} />
          </button>
        </div>
        <nav className="mt-4">
          <ul className="space-y-2">
            <li className="p-4 hover:bg-gray-200">
              <Link href="/admin/dashboard" className="flex items-center" onClick={closeSidebar}>
                <FaTachometerAlt className="mr-2 text-gray-600" />
                <span>Dashboard</span>
              </Link>
            </li>
            <li className="p-4 hover:bg-gray-200">
              <Link href="/admin/clients" className="flex items-center" onClick={closeSidebar}>
                <FaUsers className="mr-2 text-gray-600" />
                <span>Clients</span>
              </Link>
            </li>
            <li className="p-4 hover:bg-gray-200">
              <Link href="/admin/providers" className="flex items-center" onClick={closeSidebar}>
                <FaUserTie className="mr-2 text-gray-600" />
                <span>Providers</span>
              </Link>
            </li>
            <li className="p-4 hover:bg-gray-200">
              <Link href="/admin/workspaces" className="flex items-center" onClick={closeSidebar}>
                <FaBuilding className="mr-2 text-gray-600" />
                <span>Workspaces</span>
              </Link>
            </li>
            <li className="p-4 hover:bg-gray-200">
              <Link href="/admin/createspace" className="flex items-center" onClick={closeSidebar}>
                <FaPlusSquare className="mr-2 text-gray-600" />
                <span>Create Workspace</span>
              </Link>
            </li>
            <li className="p-4 hover:bg-gray-200">
              <Link href="/admin/addcategory" className="flex items-center" onClick={closeSidebar}>
                <FaCalendarCheck className="mr-2 text-gray-600" />
                <span>Add Category</span>
              </Link>
            </li>
            <li className="p-4 hover:bg-gray-200">
              <Link href="/admin/reviews" className="flex items-center" onClick={closeSidebar}>
                <FaStar className="mr-2 text-gray-600" />
                <span>Reviews</span>
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
            <Link href="/admin/dashboard" className="flex flex-col items-center">
              <AiFillHome size={24} className="text-gray-600" />
              <span className="text-xs">Home</span>
            </Link>
            <Link href="/admin/createspace" className="flex flex-col items-center">
              <IoMdAddCircle size={24} className="text-gray-600" />
              <span className="text-xs">Create</span>
            </Link>
            <Link href="/admin/providers" className="flex flex-col items-center">
              <FaUserTie size={24} className="text-gray-600" />
              <span className="text-xs">Provider</span>
            </Link>
            <Link href="/admin/clients" className="flex flex-col items-center">
              <FaUsers size={24} className="text-gray-600" />
              <span className="text-xs">Client</span>
            </Link>
          </nav>
        )}
      </div>
    </div>
  );
}
