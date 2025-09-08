"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PenLine, Bell } from "lucide-react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import LoginModal from "../LoginModal";
import BoringAvatar from "boring-avatars";

const Navbar = ({ profile}) => {
  const { data: session } = useSession();
  
  const [loginModal, setLoginModal] = useState({
    isOpen: false,
    mode: "signin",
  });

  const isLoggedIn = !!session?.user;

  const handleLoginClick = () => {
    setLoginModal({ isOpen: true, mode: "signin" });
  };
  
  const handleSignupClick = () => {
    setLoginModal({ isOpen: true, mode: "signup" });
  };
  
  const handleCloseModal = () => {
    setLoginModal({ ...loginModal, isOpen: false });
  };

  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between py-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <PenLine className="h-6 w-6 text-primary" />
            <span className="text-xl font-semibold tracking-tight">Doodle a Day</span>
          </Link>
        </div>

        {/* Nav Links */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
            Today's Prompt
          </Link>
          <Link href="/gallery" className="text-sm font-medium hover:text-primary transition-colors">
            Gallery
          </Link>
          <Link href="/leaderboard" className="text-sm font-medium hover:text-primary transition-colors">
            Leaderboard
          </Link>
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-0 right-0 flex h-2 w-2 rounded-full bg-destructive"></span>
              </Button>
              <Link href={`/${profile?.username || ""}`}>
                <div className="h-8 w-8 cursor-pointer rounded-full overflow-hidden">
                  {profile?.avatarConfig ? (
                    <BoringAvatar
                      size={32}
                      name={profile.avatarConfig.seed}
                      variant={profile.avatarConfig.variant}
                      colors={profile.avatarConfig.colors}
                    />
                  ) : (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={session.user.image || ""} alt={session.user.name || "User"} />
                      <AvatarFallback>{session.user?.name?.charAt(0) || "U"}</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              </Link>
              <Button variant="ghost" onClick={() => signOut()}>
                Log out
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                onClick={handleLoginClick}
              >
                Log in
              </Button>
              <Button
                onClick={handleSignupClick}
              >
                Sign up
              </Button>
            </>
          )}
        </div>
      </div>

      <LoginModal
        isOpen={loginModal.isOpen}
        onClose={handleCloseModal}
        initialMode={loginModal.mode}
      />
    </header>
  );
};

export default Navbar;