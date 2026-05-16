"use client";

import { useEffect } from "react";
import { useStore } from "@/store/useStore";
import { motion, AnimatePresence } from "framer-motion";
import UIControls from "./UIControls";
import Sidebar from "./Sidebar";
import BentoGrid from "./BentoGrid";
import { Loader2 } from "lucide-react";

export default function MainOverlay() {
  const { fetchData, isLoading, nodes, links, selectedNode } = useStore();

  useEffect(() => { fetchData(); }, [fetchData]);

  if (isLoading) {
    return (
      <div
        className="flex flex-col items-center justify-center w-full h-full"
        style={{ background: "var(--bg)" }}
      >
        <div className="relative">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
            style={{
              background: "rgba(255,97,48,0.1)",
              border: "1px solid rgba(255,97,48,0.3)",
            }}
          >
            <span
              className="text-2xl font-black"
              style={{ color: "var(--accent)", fontFamily: "var(--font-space)" }}
            >
              S
            </span>
          </div>
          <Loader2
            className="w-6 h-6 animate-spin absolute -right-2 -bottom-2"
            style={{ color: "var(--accent)" }}
          />
        </div>
        <h1
          className="text-2xl font-bold tracking-tight mb-2"
          style={{ color: "var(--text)", fontFamily: "var(--font-space)" }}
        >
          Startmap
        </h1>
        <p className="text-sm" style={{ color: "var(--text-muted)", fontFamily: "var(--font-inter)" }}>
          Loading startup universe...
        </p>
      </div>
    );
  }

  return (
    <main className="relative w-full h-full overflow-hidden" style={{ background: "var(--bg)" }}>
      {/* ── Bento Grid Background / Main View ── */}
      <BentoGrid />

      {/* ── Left sidebar (slides in on company click) ────── */}
      <Sidebar />

      {/* ── Top-left: Branding + Search ────────────────── */}
      <AnimatePresence>
        {!selectedNode && (
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="absolute top-5 left-5 z-20 flex flex-col gap-3 pointer-events-auto" 
            style={{ width: 340 }}
          >
            {/* Brand logo */}
            <div className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm shadow-lg"
                style={{
                  background: "linear-gradient(135deg, #FF6130, #FF3D00)",
                  color: "#fff",
                  fontFamily: "var(--font-space)",
                  boxShadow: "0 0 20px rgba(255,97,48,0.4)",
                }}
              >
                S
              </div>
              <span
                className="font-bold tracking-tight text-base"
                style={{ color: "var(--text)", fontFamily: "var(--font-space)" }}
              >
                Startmap
              </span>
              <span
                className="text-[10px] px-1.5 py-0.5 rounded-md font-semibold ml-1"
                style={{
                  background: "rgba(255,97,48,0.15)",
                  border: "1px solid rgba(255,97,48,0.3)",
                  color: "#FF8056",
                  fontFamily: "var(--font-space)",
                }}
              >
                BETA
              </span>
            </div>

            {/* Search + filters */}
            <UIControls />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Top-right: Stats ────────────────────────────── */}
      <AnimatePresence>
        {!selectedNode && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ delay: 0.2 }}
            className="absolute top-5 right-5 z-10 flex items-center gap-3 px-4 py-2.5 rounded-xl pointer-events-auto"
            style={{
              background: "rgba(4,12,30,0.85)",
              border: "1px solid rgba(100,140,255,0.10)",
              backdropFilter: "blur(20px)",
            }}
          >
            <Stat value={nodes.length} label="Companies" color="#818CF8" />
            <div style={{ width: 1, height: 24, background: "rgba(100,140,255,0.12)" }} />
            <Stat value={links.length} label="Connections" color="#22D3EE" />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

function Stat({ value, label, color }: { value: number; label: string; color: string }) {
  return (
    <div className="flex flex-col items-center" style={{ minWidth: 52 }}>
      <span
        className="text-base font-bold tabular-nums leading-none"
        style={{ color, fontFamily: "var(--font-space)" }}
      >
        {value}
      </span>
      <span
        className="text-[10px] mt-0.5"
        style={{ color: "var(--text-muted)", fontFamily: "var(--font-inter)" }}
      >
        {label}
      </span>
    </div>
  );
}
