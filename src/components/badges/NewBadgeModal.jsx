"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { BadgeAlert } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import BoringAvatar from "boring-avatars";
import Confetti from '../ui/confetti';

const backdrop = {
  visible: { opacity: 1 },
  hidden: { opacity: 0 },
};

const modal = {
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
  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="p-0 overflow-hidden rounded-lg max-w-sm" onClick={(e) => e.stopPropagation()}>
            <motion.div
              className="relative p-6 text-center bg-background rounded-lg shadow-xl"
              variants={modal}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <Confetti active={isOpen} />
              
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-100"
              >
                <BadgeAlert className="h-6 w-6 text-primary" />
              </motion.div>

              <motion.h3
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="mt-4 text-lg font-medium leading-6 text-foreground"
              >
                You earned a new badge!
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
                    <BoringAvatar
                      size={40}
                      name={badge.id}
                      variant="beam"
                      colors={['#92A1C6', '#146A7C', '#F0AB3D', '#C271B4', '#C20D90']}
                    />
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
                className="mt-5"
              >
                <Button onClick={onClose}>
                  Awesome!
                </Button>
              </motion.div>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default NewBadgeModal;