"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Avatar from "boring-avatars";
import { toast } from "sonner";
import AvatarPicker from "./AvatarPicker";

export default function ProfileModal({ isOpen, onClose, profile }) {
  const isEditing = !!profile;

  const [name, setName] = useState(profile?.name || "");
  const [username, setUsername] = useState(profile?.username || "");
  const [bio, setBio] = useState(profile?.bio || "");
  const [usernameAvailable, setUsernameAvailable] = useState(true);
  const [checking, setChecking] = useState(false);
  const [showPicker, setShowPicker] = useState(false);

  const [selectedConfig, setSelectedConfig] = useState(
    profile?.avatarConfig || {
      seed: "user-0",
      variant: "beam",
      colors: ["#92A1C6", "#146A7C", "#F0AB3D", "#C271B4", "#C20D90"],
    }
  );

  useEffect(() => {
    setUsername(profile?.username || "");
    setBio(profile?.bio || "");
    setSelectedConfig(
      profile?.avatarConfig || {
        seed: "user-0",
        variant: "beam",
        colors: ["#92A1C6", "#146A7C", "#F0AB3D", "#C271B4", "#C20D90"],
      }
    );
  }, [profile]);

  useEffect(() => {
    if (!username || (isEditing && username === profile?.username)) return;
    const timer = setTimeout(async () => {
      setChecking(true);
      try {
        const res = await fetch(
          `/api/profile/check-username?username=${username}`
        );
        const data = await res.json();
        setUsernameAvailable(data.available);
      } catch {
        setUsernameAvailable(false);
      } finally {
        setChecking(false);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [username, isEditing, profile?.username]);

  const handleSubmit = async () => {
    if (!isEditing && !usernameAvailable) {
      toast.error("Username not available ❌");
      return;
    }

    try {
      const url = isEditing ? "/api/profile/update" : "/api/profile/setup";
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          bio,
          avatarConfig: selectedConfig,
        }),
      });

      if (!res.ok) throw new Error("Failed to save profile");
      toast.success(isEditing ? "Profile updated ✅" : "Profile created 🎉");
      onClose();
    } catch (err) {
      toast.error("Error saving profile");
      console.error(err);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md rounded-2xl p-6 bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center">
            {isEditing ? "Edit your profile" : "Set up your profile"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex flex-col items-center gap-2">
            <Avatar
              size={80}
              name={selectedConfig.seed}
              variant={selectedConfig.variant}
              colors={selectedConfig.colors}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPicker((prev) => !prev)}
            >
              {showPicker ? "Close Avatar Picker" : "Edit Avatar"}
            </Button>
          </div>
          {/* Avatar Picker (Collapsible) */}
          {showPicker && (
            <AvatarPicker value={selectedConfig} onChange={setSelectedConfig} />
          )}{" "}
          <div>
            <Input
              placeholder="Display Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <Input
              placeholder="Choose a username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            {username && username != profile?.username && (
              <p className="text-sm mt-1">
                {checking
                  ? "Checking..."
                  : usernameAvailable
                  ? "✅ Username available"
                  : "❌ Username taken"}
              </p>
            )}
          </div>
          {/* Bio */}
          <Textarea
            placeholder="Write a short bio..."
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
        </div>

        <div className="mt-6 flex justify-center">
          <Button
            onClick={handleSubmit}
            disabled={(!isEditing && !usernameAvailable) || checking}
          >
            {isEditing ? "Save Changes" : "Save Profile"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
