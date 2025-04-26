"use client";

import React from "react";
import logo from "../app/og-image.png";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from '../context/languageContext';
import { useAuth } from "@lib/isLoggedIn";
import { signOut, auth } from '@lib/firebase';
import { authAPI } from "@apiManager/authAPI";
import Notification from "./notification";
import { useTranslation } from '@lib/translation/useTranslation';

const header = () => {
  const isAuthenticated = useAuth();
  const { lang, setLang } = useLanguage();
  const { t } = useTranslation();
  const logout = async () => {
    const response = await authAPI.logout();
    if (response.error) {
      return Notification({ message: response.message || "Something Error" });
    }
    await signOut(auth);
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

  const LINKS = [
    { name: t('home'), path: "/" },
    { name: t('profile_add'), path: "/profile" },
    { name: t('result'), path: "/result" },
  ]
  return (
    <div className="flex flex-wrap items-center justify-between p-2 lg:px-6 sticky top-0 bg-white shadow-md z-10">
      <Link href={"/"} className="hidden sm:block">
        <Image src={logo} alt="প্রাইজ বন্ড prize bond" width={60} height={60} />
      </Link>
      <div className="flex items-center justify-end gap-x-4 md:gap-x-6 text-xs sm:text-base">
        {LINKS.map((link, index) => (
          <Link
            key={index}
            className="w-auto px-2 py-1 rounded transition duration-200 hover:bg-black hover:text-white"
            href={link.path}
          >
            {link.name}
          </Link>
        ))}
        <button
          onClick={()=>handleAuth()}
          className="bg-red-500 hover:bg-red-700 text-white px-2 py-1 rounded-full transition duration-200 text-sm"
        >
          {isAuthenticated ? `${t('logout')}` : `${t('login')}`}
        </button>
        <button
          onClick={()=> setLang(lang === 'bn' ? 'en' : 'bn')}
          className="bg-green-200 hover:bg-green-300 px-1 py-0.5 rounded transition duration-200 text-xs"
        >
          {lang === 'bn' ? 'En' : 'বাং'}
        </button>
      </div>
    </div>
  );
};

export default header;
