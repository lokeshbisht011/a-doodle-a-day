"use client";

import React from "react";
import { motion } from "framer-motion";
import DoodleCard from "./DoodleCard";
import { Calendar } from "lucide-react";

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const DoodlesSection = ({
  date,
  prompt,
  doodles,
  currentUserProfile,
  onDoodleDeleted,
}) => {
  return (
    <motion.div
      className="mb-8"
      variants={sectionVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-bold">{date}</h2>
        </div>
        {prompt?.prompt && (
          <div className="text-left">
            <h3 className="text-lg font-bold">{prompt.prompt}</h3>
            <p className="text-sm text-muted-foreground">
              {prompt.promptDescription}
            </p>
          </div>
        )}
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
        {doodles.map((doodle) => (
          <motion.div
            key={doodle.id}
            className="flex-shrink-0 w-80"
            variants={sectionVariants}
          >
            <DoodleCard
              doodle={doodle}
              currentUserProfile={currentUserProfile}
              onDoodleDeleted={onDoodleDeleted}
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default DoodlesSection;