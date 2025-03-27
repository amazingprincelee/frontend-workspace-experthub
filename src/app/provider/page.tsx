import ProtectedRoute from "@/components/ProtectedRoute";

// app/admin/page.tsx
export default function AdminPage() {
    return (
      <ProtectedRoute allowedRoles={["provider"]}>
      <div>
        <h3 className="text-lg font-medium text-gray-700">Welcome to the Provider Area</h3>
        <p className="mt-2 text-gray-600">This is not the provider dashboard go to provider/dashboard.</p>
      </div>
      </ProtectedRoute>
    );
  }