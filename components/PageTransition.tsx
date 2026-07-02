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

  return (
    <motion.div
      key={pathname}
      initial={{
        opacity: 0,
        y: "50vh",
        scale: 0.94,
        borderRadius: "24px",
      }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
        borderRadius: "0px",
      }}
      transition={{
        duration: 0.9,
        ease: easeLarge,
      }}
      className="w-full min-h-screen bg-studio-gray relative overflow-hidden origin-bottom"
    >
      {children}
    </motion.div>
  );
}
