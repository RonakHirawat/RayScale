"use client";
import React from "react";
import { motion } from "framer-motion";
import { LampContainer } from "./ui/lamp";

export default function HomePage() {
  return (
    <LampContainer>
      <motion.h1
        initial={{ opacity: 0, y: 60 }}   // ⬆️ moved start position up
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.2,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="mt-4 bg-gradient-to-br from-slate-200 to-slate-500 py-4 bg-clip-text text-center text-5xl md:text-9xl font-black tracking-tight text-transparent"
        style={{ fontFamily: 'Outfit, sans-serif' }} // (assuming you switched font)
      >
        RayScale
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 30 }}   // ⬆️ slightly higher start
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.4,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="text-xl md:text-3xl font-medium mt-2 text-center"
        style={{ color: 'rgba(167,139,250,0.8)' }}
      >
        Smart Agriculture AI
      </motion.p>
    </LampContainer>
  );
}