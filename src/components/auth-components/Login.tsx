// Login.jsx
import React from "react";
import { useRouter } from "next/navigation";
import { notification, Spin } from "antd";
import { useFormik } from "formik";
import { useAuth } from "@/context/AuthContext";

const Login = () => {
  const [api, contextHolder] = notification.useNotification();
  const { login, authLoading } = useAuth();
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const user = await login(values);

        if (user) {
          notification.success({ message: "Login successful!" });

          // Treat any unknown role as "client"
          const userRole = user.role.toLowerCase();
          const effectiveRole = ["admin", "client", "provider"].includes(userRole)
            ? userRole
            : "client";

          // Log a warning for unknown roles (for debugging)
          if (userRole !== effectiveRole) {
            console.warn(
              `User role "${userRole}" is not recognized. Treating as "client".`
            );
          }

          // Redirect based on the effective role
          switch (effectiveRole) {
            case "admin":
              router.push("/admin/dashboard");
              break;
            case "client":
              router.push("/client/dashboard");
              break;
            case "provider":
              router.push("/provider/dashboard");
              break;
            default:
              // This should never happen since we set effectiveRole to "client" for unknown roles
              console.error("Unexpected role after effective role assignment:", effectiveRole);
              router.push("/client/dashboard");
              break;
          }
        } else {
          notification.error({ message: "Login failed. Please try again." });
        }
      } catch (error) {
        console.error("Unexpected error in login:", error);
        notification.error({
          message: "An unexpected error occurred. Please try again.",
        });
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div>
      {contextHolder}
      <form onSubmit={formik.handleSubmit}>
        <div className="my-2 text-xs">
          <label htmlFor="email" className="font-medium">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className="w-full border my-1 border-[#FA815136] p-2 rounded-sm"
            placeholder="Sample@gmail.com"
            value={formik.values.email}
            onChange={formik.handleChange}
          />
        </div>

        <div className="my-2 text-xs relative">
          <label htmlFor="password" className="font-medium">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            className="w-full border my-1 border-[#FA815136] p-2 rounded-sm"
            placeholder="************"
            value={formik.values.password}
            onChange={formik.handleChange}
          />
        </div>

        <div className="my-2 text-xs">
          <button
            type="submit"
            className="w-full bg-primary p-2 rounded-sm font-medium"
            disabled={authLoading || formik.isSubmitting}
          >
            {authLoading ? <Spin /> : "Login"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;