"use client";

import React, { useEffect, useState } from 'react';
import useWindowSize from 'react-use/lib/useWindowSize';
import ReactConfetti from 'react-confetti';
import { AnimatePresence, motion } from 'framer-motion';

const Confetti = ({ active }) => {
  const { width, height } = useWindowSize();
  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    if (active) {
      setShouldAnimate(true);
      // Automatically stop confetti after 5 seconds
      const timer = setTimeout(() => {
        setShouldAnimate(false);
      }, 5000);
      return () => clearTimeout(timer);
    } else {
      setShouldAnimate(false);
    }
  }, [active]);

  return (
    <AnimatePresence>
      {shouldAnimate && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 9999,
          }}
        >
          <ReactConfetti
            width={width}
            height={height}
            numberOfPieces={shouldAnimate ? 500 : 0}
            recycle={false}
            run={shouldAnimate}
            tweenDuration={3000}
            opacity={shouldAnimate ? 1 : 0}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Confetti;