
import React from 'react';
import DoodleCard from './DoodleCard';

const DoodleGrid = ({ doodles }) => {
  if (!doodles || doodles.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No doodles found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {doodles.map((doodle) => (
        <DoodleCard key={doodle.id} doodle={doodle} />
      ))}
    </div>
  );
};

export default DoodleGrid;
