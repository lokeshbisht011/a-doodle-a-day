// components/ShareModal.jsx

"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import {
  Twitter,
  Facebook,
  Linkedin,
  Copy,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

const socialLinks = {
  twitter: (text, url) => `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
  facebook: (text, url) => `https://www.facebook.com/sharer/sharer.php?quote=${encodeURIComponent(text)}&u=${encodeURIComponent(url)}`,
  linkedin: (text, url) => `https://www.linkedin.com/sharing/share-offsite/?summary=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
  mail: (text, url) => `mailto:?subject=${encodeURIComponent(text)}&body=${encodeURIComponent(text + " " + url)}`,
};

const ShareModal = ({ isOpen, onClose, shareData }) => {
  const { title, text, url = typeof window !== 'undefined' ? window.location.href : '' } = shareData;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(text + " " + url);
    toast({
      title: "Link Copied!",
      description: "You can now paste the text anywhere you like.",
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="max-w-md p-6">
            <DialogHeader>
              <DialogTitle className="text-center">{title}</DialogTitle>
              <DialogDescription className="text-center">{text}</DialogDescription>
            </DialogHeader>

            <div className="flex justify-center gap-4 mt-4">
              {/* Twitter Icon */}
              <a 
                href={socialLinks.twitter(text, url)} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-400 hover:bg-blue-500 text-white transition-colors"
              >
                <Twitter className="h-6 w-6" />
                <span className="sr-only">Share on Twitter</span>
              </a>
              
              {/* Facebook Icon */}
              <a 
                href={socialLinks.facebook(text, url)} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-600 hover:bg-blue-700 text-white transition-colors"
              >
                <Facebook className="h-6 w-6" />
                <span className="sr-only">Share on Facebook</span>
              </a>
              
              {/* LinkedIn Icon */}
              <a 
                href={socialLinks.linkedin(text, url)} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-800 hover:bg-blue-900 text-white transition-colors"
              >
                <Linkedin className="h-6 w-6" />
                <span className="sr-only">Share on LinkedIn</span>
              </a>

              {/* Email Icon */}
              <a 
                href={socialLinks.mail(text, url)}
                className="w-12 h-12 flex items-center justify-center rounded-full bg-red-600 hover:bg-red-700 text-white transition-colors"
              >
                <Mail className="h-6 w-6" />
                <span className="sr-only">Share via Email</span>
              </a>
            </div>

            <div className="mt-4 border-t pt-4">
              <Button onClick={handleCopyLink} variant="outline" className="w-full gap-2">
                <Copy className="h-5 w-5" /> Copy Link
              </Button>
            </div>
            
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default ShareModal;