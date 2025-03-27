"use client";
import React from "react";
import Login from "@/components/auth-components/Login";
import Link from "next/link";

const LoginPage = () => {
  return (
    <main>
      <img src="/images/auth-bg.png" className="h-[100vh] w-full" alt="" />
      <section className="absolute top-40 left-0 right-0 mx-auto lg:w-[30%] w-[95%]">
        <section className="rounded-md bg-white border border-[#FDC3327D] p-6">
          <h3 className="font-bold text-base text-center">Login</h3>
          <div className="w-full">
            <Login />
          </div>

          <div className="text-xs flex justify-center mt-2">
            <p className="text-[#052126] mr-2">Don't have an account?</p>
            <Link href="/auth/signup">
              <p className="text-[#346771]">Sign up</p>
            </Link>
          </div>
          <div className="text-xs flex justify-center mt-2">
            <Link href="/auth/forgot-password">
              <p className="text-[#346771]">Forgot Password</p>
            </Link>
          </div>
        </section>
      </section>
    </main>
  );
};

export default LoginPage;
