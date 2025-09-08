"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF, FaTwitter } from "react-icons/fa";
import { toast } from "sonner";

const LoginModal = ({ isOpen, onClose, initialMode = "signin", reason }) => {
  const [mode, setMode] = useState(initialMode);
  const [loading, setLoading] = useState(false);

  useState(() => {
    setMode(initialMode);
  }, [initialMode])

  const titleMap = {
    signin: "Welcome Back 👋",
    signup: "Join A Doodle A Day ✨",
  };

  const descriptionMap = {
    signin: "Sign in to continue your doodling journey",
    signup: "Create an account to start your streaks and earn badges",
  };

  const reasonMessage =
    reason === "save-doodle"
      ? "You need to sign in to save your doodle."
      : null;

  const handleLogin = async (provider) => {
    try {
      setLoading(true);
      const result = await signIn(provider, {
        redirect: false,
        callbackUrl: "/",
      });

      if (result?.error) {
        toast.error(`Failed to sign in with ${provider}`);
      } else {
        toast.success("Signed in successfully 🎉");
        onClose();
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md rounded-2xl p-6 bg-white">
          <DialogHeader className="space-y-2 text-center">
            <DialogTitle className="text-2xl font-bold">
              {titleMap[mode]}
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              {reasonMessage || descriptionMap[mode]}
            </DialogDescription>
          </DialogHeader>

          {/* Social logins */}
          <div className="flex flex-col gap-3 mt-4">
            <Button
              onClick={() => handleLogin("google")}
              disabled={loading}
              className="flex items-center justify-center gap-2 border rounded-lg py-2 bg-white text-gray-700 hover:bg-gray-50 shadow"
            >
              <FcGoogle className="h-5 w-5" />
              {mode === "signup"
                ? "Sign up with Google"
                : "Sign in with Google"}
            </Button>

            <Button
              onClick={() => handleLogin("facebook")}
              disabled={loading}
              className="flex items-center justify-center gap-2 bg-blue-600 text-white rounded-lg py-2 hover:bg-blue-700 shadow"
            >
              <FaFacebookF className="h-5 w-5" />
              {mode === "signup"
                ? "Sign up with Facebook"
                : "Sign in with Facebook"}
            </Button>

            <Button
              onClick={() => handleLogin("twitter")}
              disabled={loading}
              className="flex items-center justify-center gap-2 bg-sky-500 text-white rounded-lg py-2 hover:bg-sky-600 shadow"
            >
              <FaTwitter className="h-5 w-5" />
              {mode === "signup"
                ? "Sign up with Twitter"
                : "Sign in with Twitter"}
            </Button>
          </div>

          <DialogFooter className="mt-6 flex flex-col justify-center gap-2">
            <p className="text-sm text-gray-500 text-center">
              By signing in, you agree to our{" "}
              <a href="/terms" className="underline hover:text-purple-600">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="/privacy" className="underline hover:text-purple-600">
                Privacy Policy
              </a>
              .
            </p>
            {mode === "signin" ? (
              <p className="text-sm text-gray-600 text-center">
                Don’t have an account?{" "}
                <button
                  onClick={() => setMode("signup")}
                  className="text-purple-600 hover:underline"
                >
                  Sign up
                </button>
              </p>
            ) : (
              <p className="text-sm text-gray-600 text-center">
                Already have an account?{" "}
                <button
                  onClick={() => setMode("signin")}
                  className="text-purple-600 hover:underline"
                >
                  Sign in
                </button>
              </p>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LoginModal;