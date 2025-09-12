"use client";

import React from "react";
import { motion } from "framer-motion";
import DoodleCard from "./DoodleCard";

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      staggerChildren: 0.1
    }
  },
};

const DoodlesSection = ({ date, prompt, doodles, currentUserProfile, onDoodleDeleted }) => {
  return (
    <motion.div 
      className="mb-8"
      variants={sectionVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="mb-4">
        <h2 className="text-2xl font-bold">{date}</h2>
        {prompt && (
          <p className="text-muted-foreground">{prompt.title} - {prompt.promptDescription}</p>
        )}
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
        {doodles.map((doodle) => (
          <motion.div 
            key={doodle.id} 
            className="flex-shrink-0 w-80"
            variants={sectionVariants}
          >
            <DoodleCard doodle={doodle} currentUserProfile={currentUserProfile} onDoodleDeleted={onDoodleDeleted} />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default DoodlesSection;
