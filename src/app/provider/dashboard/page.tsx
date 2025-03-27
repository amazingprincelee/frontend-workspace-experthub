import ProtectedRoute from "@/components/ProtectedRoute";

// app/admin/page.tsx
export default function AdminPage() {
    return (
      <ProtectedRoute allowedRoles={["provider"]}>
      <div>
        <h3 className="text-lg font-medium text-gray-700">Welcome to the Provider Dashboard</h3>
        <p className="mt-2 text-gray-600">This is the main content area for your provider panel and settings.</p>
      </div>
      </ProtectedRoute>
    );
  }