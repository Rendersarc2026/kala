"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

interface PageTransitionProps {
  children: React.ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const easeLarge: [number, number, number, number] = [0.16, 1, 0.3, 1];

  if (pathname.startsWith("/admin")) {
    return <>{children}</>;
  }

  return (
    <motion.div
      key={pathname}
      initial={{
        opacity: 0,
        y: 12,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.35,
        ease: [0.215, 0.61, 0.355, 1], // easeOutCubic for a refined, responsive feel
      }}
      className="w-full min-h-screen bg-studio-gray relative overflow-hidden"
    >
      {children}
    </motion.div>
  );
}
