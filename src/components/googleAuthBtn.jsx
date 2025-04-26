"use client";
import { signInWithPopup, auth, provider } from "@lib/firebase";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { authAPI } from "@apiManager/authAPI";
import Notification from "./notification";
import Image from "next/image";
import googleIcon from "@assets/google.png";

export default function GoogleAuthButton( { signup = false }) {
  const router = useRouter();

  const login = async () => {
    try {
      const res = await signInWithPopup(auth, provider);
      let dbResponse;
      if (res?._tokenResponse?.isNewUser) {
        dbResponse = await authAPI.signup({
          name: res.user.displayName,
          email: res.user.email,
          password: res.user.uid,
          google_user: 1,
        });
      } else {
        dbResponse = await authAPI.login({
          email: res.user.email,
          password: res.user.uid,
          google_user: 1,
        });
      }
      if (dbResponse.error) {
        return Notification({
          message: dbResponse.message || "Something Error",
        });
      }
      localStorage.setItem("token", dbResponse.data.token);
      Notification({
        type: "success",
        message: dbResponse.message,
        background: "green",
        duration: 5000,
      });
      router.push("/");
    } catch (error) {
      Notification({
        message: "Login Failed for technical issue.",
      });
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <hr className="w-full border-gray-300" />
        <span className="text-gray-500 text-sm px-2">or</span>
        <hr className="w-full border-gray-300" />
      </div>
      <Button className='w-full cursor-pointer border-2 bg-white text-black hover:bg-amber-800 hover:text-white transition-all duration-300' onClick={login}>
        <div className="flex items-center justify-center">
          <Image
            src={googleIcon}
            alt="prize bond google icon"
            className="w-5 h-5 mr-2"
          />
          { signup ? "Sign up with Google" : "Sign in with Google" }
        </div>
      </Button>
    </div>
  );
}
