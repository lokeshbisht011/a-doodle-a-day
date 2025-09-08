// components/user/BadgeCard.jsx

import React from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const BadgeCard = ({ badge }) => {
  return (
    <motion.div
      className={`p-4 rounded-lg shadow-sm h-full flex flex-col items-center justify-center text-center transition-all duration-300 transform hover:scale-[1.02] ${
        badge.isEarned ? "bg-card shadow-lg" : "bg-muted/50 hover:bg-muted"
      }`}
      variants={cardVariants}
    >
      <div 
        className={`relative flex items-center justify-center h-20 w-20 p-2 overflow-hidden mb-4 transition-all duration-300 transform scale-100 ${
          badge.isEarned ? "bg-primary/20" : "bg-muted"
        }`}
        style={{
          clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)',
        }}
      >
        <span className={`text-4xl leading-none transition-all duration-300 ${
          badge.isEarned ? "text-primary" : "text-muted-foreground opacity-50"
        }`}>
          {badge.icon}
        </span>
      </div>

      <div className="flex-1">
        <h4 className={`text-lg font-semibold leading-tight ${
          badge.isEarned ? "" : "text-muted-foreground"
        }`}>
          {badge.name}
        </h4>
        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
          {badge.description}
        </p>
      </div>
      
      {badge.isEarned ? (
        <Badge variant="secondary" className="mt-4 px-3 py-1">
          Earned!
        </Badge>
      ) : (
        <div className="w-full mt-4">
          <p className="text-xs text-muted-foreground mb-1">
            Progress: {badge.progress}%
          </p>
          <Progress value={badge.progress} className="h-2" />
        </div>
      )}
    </motion.div>
  );
};

export default BadgeCard;