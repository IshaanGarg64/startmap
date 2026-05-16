"use client";

import { useStore, Node, INDUSTRY_COLORS, INDUSTRY_BG } from "@/store/useStore";
import { motion, AnimatePresence } from "framer-motion";
import { useMemo } from "react";

export default function BentoGrid() {
  const { filteredNodes, filteredLinks, selectedNode, setSelectedNode } = useStore();

  const displayNodes = useMemo(() => {
    if (!selectedNode) {
      // Show all nodes sorted alphabetically for neatness
      return [...filteredNodes].sort((a,b) => a.name.localeCompare(b.name)).map(n => ({
        node: n,
        isHero: false,
        isRelated: false,
      }));
    }

    // Find connections
    const relatedIds = new Set<string>();
    filteredLinks.forEach(l => {
      const srcId = typeof l.source === "object" ? l.source.id : l.source;
      const tgtId = typeof l.target === "object" ? l.target.id : l.target;
      if (srcId === selectedNode.id) relatedIds.add(tgtId);
      if (tgtId === selectedNode.id) relatedIds.add(srcId);
    });

    const results = [];
    results.push({ node: selectedNode, isHero: true, isRelated: false });
    
    // Push related nodes next
    filteredNodes.forEach(n => {
      if (relatedIds.has(n.id) && n.id !== selectedNode.id) {
        results.push({ node: n, isHero: false, isRelated: true });
      }
    });

    return results;
  }, [filteredNodes, filteredLinks, selectedNode]);

  return (
    <div className={`absolute inset-0 z-0 p-6 pb-24 overflow-y-auto overflow-x-hidden glass custom-scrollbar transition-all duration-500 ${selectedNode ? "pt-[80px] pl-[380px]" : "pt-[240px]"}`}>
      {/* Background decoration */}
      <div className="animated-bg" />

      <div className="max-w-[1800px] mx-auto w-full">
        {selectedNode && (
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-space font-bold text-white tracking-tight flex items-center gap-3">
              <span className="w-2 h-8 rounded-full" style={{ background: INDUSTRY_COLORS[selectedNode.industry] ?? INDUSTRY_COLORS.Default }} />
              Ecosystem View
            </h2>
            <button
              onClick={() => setSelectedNode(null)}
              className="px-4 py-2 text-sm font-semibold rounded-xl bg-white/5 hover:bg-white/10 text-white transition-colors flex items-center gap-2 border border-white/5"
            >
              Back to Overview
            </button>
          </div>
        )}

        <motion.div 
          layout
          className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-5 auto-rows-[160px]"
        >
          <AnimatePresence mode="popLayout">
            {displayNodes.map(({ node, isHero, isRelated }) => {
              const color = INDUSTRY_COLORS[node.industry] ?? INDUSTRY_COLORS.Default;
              const spanClass = isHero 
                ? "col-span-full md:col-span-4 lg:col-span-6 row-span-3 lg:row-span-2"
                : isRelated 
                  ? "col-span-full md:col-span-3 lg:col-span-2 row-span-2" 
                  : "col-span-full sm:col-span-2 md:col-span-2 row-span-1";

              return (
                <motion.div
                  layout
                  layoutId={`card-${node.id}`}
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
                  whileHover={{ scale: 1.02, rotateX: 2, rotateY: -2 }}
                  transition={{ type: "spring", bounce: 0.15, duration: 0.6 }}
                  key={node.id}
                  onClick={() => setSelectedNode(isHero ? null : node)}
                  className={`
                    cursor-pointer p-6 rounded-3xl overflow-hidden relative group transition-all
                    ${spanClass}
                  `}
                  style={{
                    background: INDUSTRY_BG[node.industry] ? `linear-gradient(145deg, rgba(8, 16, 42, 0.7) 0%, rgba(3, 8, 22, 0.95) 100%), url(${INDUSTRY_BG[node.industry]}) center/cover no-repeat` : `linear-gradient(145deg, rgba(8, 16, 42, 0.7) 0%, rgba(3, 8, 22, 0.85) 100%)`,
                    border: `1px solid ${color}40`,
                    backdropFilter: "blur(12px)",
                    boxShadow: `0 12px 40px rgba(0,0,0,0.5), inset 0 0 0 1px ${color}15, inset 0 1px 0 rgba(255,255,255,0.1)`,
                    transformStyle: "preserve-3d",
                  }}
                >
                  {/* Subtle Glow Background */}
                  <div 
                    className="absolute -inset-10 opacity-0 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none"
                    style={{
                      background: `radial-gradient(circle at 40% 40%, ${color} 0%, transparent 70%)`
                    }}
                  />
                  {/* Hero specific large glow */}
                  {isHero && (
                    <div 
                      className="absolute inset-0 opacity-10 pointer-events-none"
                      style={{
                        background: `radial-gradient(circle at 90% 10%, ${color} 0%, transparent 60%)`
                      }}
                    />
                  )}

                  <div className="relative z-10 h-full flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between mb-3">
                        <div 
                          className="w-12 h-12 rounded-[14px] flex items-center justify-center text-xl font-bold font-space text-white shadow-lg bg-cover bg-center"
                          style={{
                            backgroundImage: INDUSTRY_BG[node.industry] ? `url(${INDUSTRY_BG[node.industry]})` : `linear-gradient(135deg, ${color}, ${color}90)`,
                            boxShadow: `0 4px 20px ${color}50, inset 0 2px 0 rgba(255,255,255,0.3)`,
                          }}
                        >
                          {INDUSTRY_BG[node.industry] ? <span className="mix-blend-overlay opacity-80">{node.name.charAt(0)}</span> : node.name.charAt(0)}
                        </div>
                        <span 
                          className="text-[11px] px-2.5 py-1 rounded-full font-semibold tracking-wider font-inter uppercase shadow-sm"
                          style={{
                            background: `${color}15`,
                            color: color,
                            border: `1px solid ${color}30`,
                          }}
                        >
                          {node.industry} {isRelated && "· Related"}
                        </span>
                      </div>
                      
                      <h3 className={`font-bold font-space text-white mt-4 tracking-tight ${isHero || isRelated ? 'text-2xl md:text-3xl' : 'text-xl'}`}>
                        {node.name}
                      </h3>
                      
                      {/* Only show deep description if it's large card (hero or related) */}
                      {(isHero || isRelated) && (
                        <p className="text-sm md:text-base text-gray-300 font-inter mt-3 leading-relaxed max-w-3xl opacity-90">
                          {node.description}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 mt-5 flex-wrap">
                      {JSON.parse(node.tags || "[]").map((t: string) => (
                        <span 
                          key={t}
                          className="text-[11px] px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-400 font-medium font-inter tracking-wide transition-colors group-hover:bg-white/10"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
      `}} />
    </div>
  );
}
