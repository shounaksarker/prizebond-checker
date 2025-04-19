"use client";

import React from "react";
import logo from "../assets/logo.jpeg";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@lib/isLoggedIn";
import { authAPI } from "@apiManager/authAPI";
import Notification from "./notification";

const header = () => {
  const isAuthenticated = useAuth();
  const logout = async () => {
    const response = await authAPI.logout();
    if (response.error) {
      return Notification({ message: response.message || "Something Error" });
    }
    localStorage.removeItem("token");
    location.reload();
  };

  const handleAuth = () => {
    if (isAuthenticated) {
      logout();
    } else {
      location.href = "/auth/login";
    }
  };
  return (
    <div className="flex items-center justify-between p-2">
      <div>
        <Image src={logo} alt="Logo" width={50} height={50} />
      </div>
      <div className="flex items-center justify-end gap-x-4 md:gap-x-6">
        <Link
          className="px-2 py-1 rounded transition duration-200 hover:bg-black hover:text-white"
          href={"/"}
        >
          Home
        </Link>
        <Link
          className="px-2 py-1 rounded transition duration-200 hover:bg-black hover:text-white"
          href={"/profile"}
        >
          Profile / Add Prizebond
        </Link>
        <Link
          className="px-2 py-1 rounded transition duration-200 hover:bg-black hover:text-white"
          href={"/result"}
        >
          Result
        </Link>
        <button
          onClick={()=>handleAuth()}
          href={"/auth/login"}
          className="bg-red-500 hover:bg-red-700 text-white px-2 py-1 rounded-full transition duration-200 text-sm"
        >
          {isAuthenticated ? "Logout" : "Login"}
        </button>
      </div>
    </div>
  );
};

export default header;
