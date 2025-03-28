// app/admin/layout.tsx
import { ReactNode } from "react";
import { FaTachometerAlt, FaUsers, FaPlusSquare, FaWallet, FaLifeRing, FaCog, FaBriefcase } from "react-icons/fa";

interface ProviderLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: ProviderLayoutProps) {
  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-white shadow-md">
        <div className="p-4">
          <h1 className="text-2xl font-bold text-gray-800">Provider Panel</h1>
        </div>
        <nav className="mt-4">
          <ul>
            <li className="p-4 hover:bg-gray-200">
              <a href="/provider" className="flex items-center">
                <FaTachometerAlt className="mr-2 text-gray-600" />
                <span>Dashboard</span>
              </a>
            </li>
            <li className="p-4 hover:bg-gray-200">
              <a href="/provider/clients" className="flex items-center">
                <FaUsers className="mr-2 text-gray-600" />
                <span>My Clients</span>
              </a>
            </li>
            <li className="p-4 hover:bg-gray-200">
              <a href="/provider/createspace" className="flex items-center">
                <FaPlusSquare className="mr-2 text-gray-600" />
                <span>Create Workspace</span>
              </a>
            </li>
            <li className="p-4 hover:bg-gray-200">
              <a href="/provider/createspace" className="flex items-center">
              <FaBriefcase className="mr-2 text-gray-600" />
                <span>My Workspaces</span>
              </a>
            </li>
            <li className="p-4 hover:bg-gray-200">
              <a href="/provider/wallet" className="flex items-center">
                <FaWallet className="mr-2 text-gray-600" />
                <span>Wallet</span>
              </a>
            </li>
            <li className="p-4 hover:bg-gray-200">
              <a href="/provider/support" className="flex items-center">
                <FaLifeRing className="mr-2 text-gray-600" />
                <span>Support</span>
              </a>
            </li>
            <li className="p-4 hover:bg-gray-200">
              <a href="/provider/settings" className="flex items-center">
                <FaCog className="mr-2 text-gray-600" />
                <span>Settings</span>
              </a>
            </li>
          </ul>
        </nav>
      </aside>
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow p-4">
          <h2 className="text-xl font-semibold text-gray-800">Provider Dashboard</h2>
        </header>
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}