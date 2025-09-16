"use client";

import { useEffect, useState } from "react";
import { SessionProvider, useSession } from "next-auth/react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import ProfileSetupModal from "./ProfileModal";
import { useBadges } from "@/hooks/useBadges";
import NewBadgeModal from "./badges/NewBadgeModal";

const queryClient = new QueryClient();

function ProfileSetupWatcher() {
  const { data: session, status } = useSession();
  const [showProfileSetup, setShowProfileSetup] = useState(false);

  useEffect(() => {
    const checkProfile = async () => {
      if (status === "authenticated" && session?.user?.email) {
        try {
          const res = await fetch("/api/profile/check-exists");
          const { exists } = await res.json();
          if (!exists) {
            setShowProfileSetup(true);
          }
        } catch (err) {
          console.error("Profile check failed", err);
        }
      }
    };
    checkProfile();
  }, [session, status]);

  return (
    <ProfileSetupModal
      isOpen={showProfileSetup}
      onClose={() => setShowProfileSetup(false)}
    />
  );
}

export default function Providers({ children }) {
  const { showNewBadgeModal, setShowNewBadgeModal, earnedBadges } = useBadges();
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        {children}
        <ProfileSetupWatcher />
        <NewBadgeModal
          isOpen={showNewBadgeModal}
          onClose={() => setShowNewBadgeModal(false)}
          badges={earnedBadges}
        />
      </SessionProvider>
    </QueryClientProvider>
  );
}
