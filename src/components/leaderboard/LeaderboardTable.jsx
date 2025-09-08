// components/leaderboard/LeaderboardTable.jsx

'use client'

import React from 'react';
import Link from 'next/link'; // Use next/link
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import BoringAvatar from 'boring-avatars';

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

const LeaderboardTable = ({ leaders, valueLabel, icon }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left py-4 px-4 font-medium">Rank</th>
            <th className="text-left py-4 px-4 font-medium">User</th>
            <th className="text-right py-4 px-4 font-medium">{valueLabel}</th>
          </tr>
        </thead>
        <motion.tbody
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
        >
          {leaders.map((user, index) => (
            <motion.tr
              key={user.id}
              className="border-b last:border-b-0 hover:bg-muted/50 transition-colors"
              variants={itemVariants}
            >
              <td className="py-4 px-4">
                {index < 3 ? (
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold">
                    {index + 1}
                  </span>
                ) : (
                  <span className="px-3">{index + 1}</span>
                )}
              </td>
              <td className="py-4 px-4">
                <Link href={`/${user.username}`} className="flex items-center gap-3 hover:underline">
                  {user.avatarConfig ? (
                     <BoringAvatar
                        size={32}
                        name={user.avatarConfig.seed}
                        variant={user.avatarConfig.variant}
                        colors={user.avatarConfig.colors}
                     />
                  ) : (
                    <Avatar>
                      <AvatarImage src={user.image} alt={user.name} />
                      <AvatarFallback>{user.name?.charAt(0) || "U"}</AvatarFallback>
                    </Avatar>
                  )}
                  <div>
                    <div className="font-medium">{user.username}</div>
                    <div className="flex gap-1 mt-1">
                      {user.badges && user.badges.map((badge, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {badge.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </Link>
              </td>
              <td className="py-4 px-4 text-right">
                <div className="flex items-center justify-end gap-1 font-semibold">
                  <span>{icon}</span>
                  {valueLabel === 'Most Liked' ? user.mostLikes : 
                   valueLabel === 'Top Doodlers' ? user.submissions : 
                   `${user.streak} days`}
                </div>
              </td>
            </motion.tr>
          ))}
        </motion.tbody>
      </table>
    </div>
  );
};

export default LeaderboardTable;