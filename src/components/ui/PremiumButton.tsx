import React from 'react';
import { motion, HTMLMotionProps } from 'motion/react';

interface PremiumButtonProps extends HTMLMotionProps<"button"> {
  children: React.ReactNode;
  hapticFeedback?: boolean;
}

export default function PremiumButton({
  children,
  onClick,
  hapticFeedback = true,
  className = '',
  ...props
}: PremiumButtonProps) {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (hapticFeedback && typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate(50); // Light tap vibration
      } catch (err) {
        // Fallback for unsupported devices/browsers
      }
    }
    
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      onClick={handleClick}
      className={className}
      {...props}
    >
      {children}
    </motion.button>
  );
}
