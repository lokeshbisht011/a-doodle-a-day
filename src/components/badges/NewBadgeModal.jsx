"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Award, Share2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Confetti from "../ui/confetti";
import ShareModal from "../ShareModal";

const modalVariants = {
  hidden: { y: "-100vh", opacity: 0, scale: 0.5 },
  visible: {
    y: "0",
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20,
    },
  },
  exit: { y: "100vh", opacity: 0, scale: 0.5 },
};

const NewBadgeModal = ({ isOpen, onClose, badges }) => {
  const [isShareModalOpen, setIsShareModalOpen] = React.useState(false);

  // Data for the ShareModal
  const badgeShareData = {
    title: `Badge Unlocked!`,
    text: `I just earned the "${badges[0]?.name}" badge on A-Doodle-A-Day! Check it out!`,
    url: typeof window !== 'undefined' ? window.location.href : '',
  };
  
  // UX consideration: if the user earned multiple badges, we can update the share text
  if (badges.length > 1) {
    badgeShareData.title = `Multiple Badges Unlocked!`;
    badgeShareData.text = `I just earned ${badges.length} new badges on A-Doodle-A-Day! Check them out!`;
  }

  const handleShareClick = () => {
    setIsShareModalOpen(true);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent
              className="p-0 overflow-hidden rounded-lg max-w-sm"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div
                className="relative p-6 text-center bg-background rounded-lg shadow-xl"
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <Confetti active={isOpen} />

                {/* Close Button */}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute top-2 right-2 rounded-full text-muted-foreground hover:bg-muted"
                  onClick={onClose}
                >
                  <X className="h-4 w-4" />
                </Button>

                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10"
                >
                  <Award className="h-6 w-6 text-primary" />
                </motion.div>

                <motion.h3
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="mt-4 text-lg font-medium leading-6 text-foreground"
                >
                  Badge Unlocked!
                </motion.h3>

                <div className="mt-2 text-sm text-muted-foreground">
                  {badges.map((badge, index) => (
                    <motion.div
                      key={badge.id}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                      className="flex items-center gap-3 p-4 bg-muted rounded-md my-2"
                    >
                      <span className="text-4xl leading-none transition-all duration-300">
                        {badge.icon}
                      </span>
                      <div className="text-left">
                        <p className="font-semibold">{badge.name}</p>
                        <p className="text-xs">{badge.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                  className="mt-5 flex justify-center gap-3"
                >
                  <Button onClick={onClose} variant="outline">Close</Button>
                  <Button onClick={handleShareClick}>
                    <Share2 className="mr-2 h-4 w-4" />
                    Share
                  </Button>
                </motion.div>
              </motion.div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        shareData={badgeShareData}
      />
    </>
  );
};

export default NewBadgeModal;