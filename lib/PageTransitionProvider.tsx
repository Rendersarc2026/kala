"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

interface PageTransitionContextType {
  navigate: (href: string) => void;
}

const PageTransitionContext = createContext<PageTransitionContextType>({
  navigate: () => {},
});

export function usePageTransition() {
  return useContext(PageTransitionContext);
}

export default function PageTransitionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isAnimating, setIsAnimating] = useState(false);
  const [pendingHref, setPendingHref] = useState<string | null>(null);
  const [phase, setPhase] = useState<"idle" | "slide-up" | "expand" | "exit">("idle");

  const navigate = useCallback(
    (href: string) => {
      if (isAnimating) return;
      setPendingHref(href);
      setIsAnimating(true);
      setPhase("slide-up");
    },
    [isAnimating],
  );

  return (
    <PageTransitionContext.Provider value={{ navigate }}>
      {children}

      <AnimatePresence>
        {isAnimating && (
          <motion.div
            key="page-transition-card"
            className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none"
          >
            {/* Step 1: slide up from bottom, then expand inside-out */}
            <motion.div
              initial={{
                width: "40vw",
                height: "60vh",
                y: "100vh",
                borderRadius: "24px",
              }}
              animate={
                phase === "slide-up"
                  ? { y: 0, borderRadius: "24px", opacity: 1 }
                  : phase === "expand"
                    ? {
                        width: "100vw",
                        height: "100vh",
                        y: 0,
                        borderRadius: "0px",
                        opacity: 1,
                      }
                    : {
                        width: "100vw",
                        height: "100vh",
                        y: 0,
                        borderRadius: "0px",
                        opacity: 0,
                        scale: 0.98,
                      }
              }
              transition={{
                duration: phase === "slide-up" ? 0.8 : phase === "expand" ? 0.9 : 1.2,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              onAnimationComplete={() => {
                if (phase === "slide-up") {
                  setPhase("expand");
                }
                if (phase === "expand") {
                  if (pendingHref) {
                    router.push(pendingHref);
                  }
                  requestAnimationFrame(() => {
                    setPhase("exit");
                  });
                }
                if (phase === "exit") {
                  setIsAnimating(false);
                  setPendingHref(null);
                  setPhase("idle");
                }
              }}
              className="bg-studio-gray shadow-2xl"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </PageTransitionContext.Provider>
  );
}
