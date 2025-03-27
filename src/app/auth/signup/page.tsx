"use client";

import Link from "next/link";
import React, { useState } from "react";
import SignUpComp from "@/components/auth-components/SignUpComp";

const signup = () => {
  const [role, setRole] = useState("client");

  return (
    <main >
      <img src="/images/auth-bg.png" className="h-[100vh] w-full" alt="" />
      <section className="absolute top-10 left-0 right-0 mx-auto lg:w-[30%] w-[95%] mt-16">
        <section className="rounded-md bg-white border border-[#FDC3327D] p-6 ">
          <h3 className="font-bold text-base text-center">Sign up</h3>
          <div className="flex my-3 justify-evenly">
            <button
              onClick={() => setRole("provider")}
              className={
                role === "provider"
                  ? "bg-primary text-sm p-1 px-6 rounded-sm"
                  : "bg-gray p-1 px-6 text-sm rounded-sm"
              }
            >
              Provider
            </button>
            <button
              onClick={() => setRole("client")}
              className={
                role === "provider"
                  ? "bg-primary p-1 px-6 text-sm rounded-sm"
                  : "bg-gray p-1 px-6 text-sm rounded-sm"
              }
            >
              Client
            </button>
          </div>

          
          <SignUpComp contact={false} role={role} />
         
        </section>
        <div className="text-xs flex justify-center mt-2">
          <p className="text-[#052126] mr-2">Do you have an account?</p>
          <Link href={"/auth/login"}>
            <p className="text-[#346771]">Login</p>
          </Link>
        </div>
      </section>
    </main>
  );
};

export default signup;
