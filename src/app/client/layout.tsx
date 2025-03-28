// app/admin/layout.tsx (for clients)
import { ReactNode } from "react";
import { FaTachometerAlt, FaBuilding, FaUserTie, FaCalendarCheck, FaWallet, FaCog, FaLifeRing, FaBriefcase } from "react-icons/fa";

interface ClientLayoutProps {
  children: ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-white shadow-md">
        <div className="p-4">
          <h1 className="text-2xl font-bold text-gray-800">Client Panel</h1>
        </div>
        <nav className="mt-4">
          <ul>
            <li className="p-4 hover:bg-gray-200">
              <a href="/client" className="flex items-center">
                <FaTachometerAlt className="mr-2 text-gray-600" />
                <span>Dashboard</span>
              </a>
            </li>
            <li className="p-4 hover:bg-gray-200">
              <a href="/client/experthub" className="flex items-center">
                <FaBuilding className="mr-2 text-gray-600" />
                <span>ExpertHub Workspaces</span>
              </a>
            </li>
            <li className="p-4 hover:bg-gray-200">
              <a href="/client/provider" className="flex items-center">
                <FaUserTie className="mr-2 text-gray-600" />
                <span>Providers Workspaces</span>
              </a>
            </li>
            <li className="p-4 hover:bg-gray-200">
              <a href="/client/subscriptions" className="flex items-center">
                <FaBriefcase className="mr-2 text-gray-600" />
                <span>Subscriptions</span>
              </a>
            </li>
            <li className="p-4 hover:bg-gray-200">
              <a href="/client/payments" className="flex items-center">
                <FaWallet className="mr-2 text-gray-600" />
                <span>Payments</span>
              </a>
            </li>
             <li className="p-4 hover:bg-gray-200">
                          <a href="/client/support" className="flex items-center">
                            <FaLifeRing className="mr-2 text-gray-600" />
                            <span>Support</span>
                          </a>
                        </li>
            <li className="p-4 hover:bg-gray-200">
              <a href="/client/settings" className="flex items-center">
                <FaCog className="mr-2 text-gray-600" />
                <span>Settings</span>
              </a>
            </li>
          </ul>
        </nav>
      </aside>
      <div className="flex-1 flex flex-col mt-8">
        
        <main className="flex-1 mt-8 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}