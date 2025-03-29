// app/admin/layout.tsx
import { ReactNode } from "react";
import {
  FaTachometerAlt,
  FaUsers,
  FaUserTie,
  FaBuilding,
  FaCalendarCheck,
  FaWallet,
  FaLifeRing,
  FaCog,
  FaPlusSquare,
} from "react-icons/fa";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-white shadow-md">
        <div className="p-4">
          <h1 className="text-2xl font-bold text-gray-800">Admin Panel</h1>
        </div>
        <nav className="mt-4">
          <ul>
            <li className="p-4 hover:bg-gray-200">
              <a href="/admin/dashboard" className="flex items-center">
                <FaTachometerAlt className="mr-2 text-gray-600" />
                <span>Dashboard</span>
              </a>
            </li>
            <li className="p-4 hover:bg-gray-200">
              <a href="/admin/clients" className="flex items-center">
                <FaUsers className="mr-2 text-gray-600" />
                <span>Clients</span>
              </a>
            </li>
            <li className="p-4 hover:bg-gray-200">
              <a href="/admin/providers" className="flex items-center">
                <FaUserTie className="mr-2 text-gray-600" />
                <span>Providers</span>
              </a>
            </li>
            <li className="p-4 hover:bg-gray-200">
              <a href="/admin/workspaces" className="flex items-center">
                <FaBuilding className="mr-2 text-gray-600" />
                <span>Workspaces</span>
              </a>
            </li>
            
              <li className="p-4 hover:bg-gray-200">
                          <a href="/admin/createspace" className="flex items-center">
                            <FaPlusSquare className="mr-2 text-gray-600" />
                            <span>Create Workspace</span>
                          </a>
              </li>

            <li className="p-4 hover:bg-gray-200">
              <a href="/admin/addcategory" className="flex items-center">
                <FaCalendarCheck className="mr-2 text-gray-600" />
                <span>Add Category</span>
              </a>
            </li>
            <li className="p-4 hover:bg-gray-200">
              <a href="/admin/payments" className="flex items-center">
                <FaWallet className="mr-2 text-gray-600" />
                <span>Payments</span>
              </a>
            </li>
           
            <li className="p-4 hover:bg-gray-200">
              <a href="/admin/settings" className="flex items-center">
                <FaCog className="mr-2 text-gray-600" />
                <span>Settings</span>
              </a>
            </li>
          </ul>
        </nav>
      </aside>
      <div className="flex-1 flex flex-col mt-8">
       
        <main className="flex-1 p-6 overflow-y-auto mt-8">{children}</main>
      </div>
    </div>
  );
}