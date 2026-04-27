"use client";
import React from "react";
import { motion } from "framer-motion";
import { cn } from "../../utils/cn";

export const LampContainer = ({ children, className }) => {
  return (
    <div
      className={cn(
        "relative flex min-h-[calc(100vh-80px)] flex-col items-center justify-center overflow-hidden bg-transparent w-full rounded-md z-0 -translate-y-16",
        className
      )}
    >
      <div className="relative flex w-full flex-1 scale-y-125 items-center justify-center isolate z-0 mt-32">
        <motion.div
          initial={{ opacity: 0.5, width: "15rem" }}
          whileInView={{ opacity: 1, width: "30rem" }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
          style={{
            backgroundImage: `conic-gradient(var(--conic-position), var(--tw-gradient-stops))`,
            WebkitMaskImage: `linear-gradient(to top, transparent, white 20%, white 100%), linear-gradient(to right, transparent, white 20%, white 100%)`,
            WebkitMaskComposite: `destination-in`,
            maskComposite: `intersect`
          }}
          className="absolute inset-auto right-1/2 h-56 overflow-visible w-[30rem] bg-gradient-conic from-[#8b5cf6] via-transparent to-transparent text-white [--conic-position:from_70deg_at_center_top]"
        />
        
        <motion.div
          initial={{ opacity: 0.5, width: "15rem" }}
          whileInView={{ opacity: 1, width: "30rem" }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
          style={{
            backgroundImage: `conic-gradient(var(--conic-position), var(--tw-gradient-stops))`,
            WebkitMaskImage: `linear-gradient(to top, transparent, white 20%, white 100%), linear-gradient(to left, transparent, white 20%, white 100%)`,
            WebkitMaskComposite: `destination-in`,
            maskComposite: `intersect`
          }}
          className="absolute inset-auto left-1/2 h-56 w-[30rem] bg-gradient-conic from-transparent via-transparent to-[#a3e635] text-white [--conic-position:from_290deg_at_center_top]"
        />
        
        <div className="absolute top-1/2 z-50 h-48 w-full bg-transparent opacity-10 backdrop-blur-md"></div>
        <div className="absolute inset-auto z-50 h-36 w-[28rem] -translate-y-1/2 rounded-full bg-[#8b5cf6] opacity-30 blur-3xl"></div>
        
        <motion.div
          initial={{ width: "8rem" }}
          whileInView={{ width: "16rem" }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-auto z-30 h-36 w-64 -translate-y-[6rem] rounded-full bg-[#a78bfa] blur-2xl"
        ></motion.div>
        
        <motion.div
          initial={{ width: "15rem" }}
          whileInView={{ width: "30rem" }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-auto z-50 h-0.5 w-[30rem] -translate-y-[7rem] bg-[#a3e635] opacity-80"
        ></motion.div>
      </div>

      <div className="relative z-50 flex -translate-y-80 flex-col items-center px-5">
        {children}
      </div>
    </div>
  );
};
