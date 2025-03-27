import ProtectedRoute from "@/components/ProtectedRoute"


 const client = () => {

    return (
        <ProtectedRoute allowedRoles={["client"]}>
        <>
            <h1>Welcome to the client area</h1>
        </>
        </ProtectedRoute>
    )

}


export default client