"use client";

import { useStore, INDUSTRY_COLORS, INDUSTRY_BG, Node } from "@/store/useStore";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, Building2, Calendar, Hash, Sparkles, ArrowRight } from "lucide-react";
import { useState } from "react";

// ── helpers ────────────────────────────────────────────────────
function getDomain(website: string) {
  try { return new URL(website).hostname.replace(/^www\./, ""); }
  catch { return website; }
}
function getLogoUrl(website: string) {
  const domain = getDomain(website);
  return `https://logo.clearbit.com/${domain}`;
}
function parseTags(raw: string | undefined): string[] {
  if (!raw) return [];
  try { return JSON.parse(raw); } catch { return []; }
}

// ── IndustryBadge ──────────────────────────────────────────────
function IndustryBadge({ industry }: { industry: string }) {
  const color = INDUSTRY_COLORS[industry] ?? INDUSTRY_COLORS["Default"];
  return (
    <span
      className="px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide"
      style={{
        background: color + "20",
        border: `1px solid ${color}50`,
        color,
        fontFamily: "var(--font-space)",
      }}
    >
      {industry}
    </span>
  );
}

// ── BatchBadge ─────────────────────────────────────────────────
function BatchBadge({ batch }: { batch: string }) {
  return (
    <span
      className="px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide"
      style={{
        background: "rgba(255,97,48,0.15)",
        border: "1px solid rgba(255,97,48,0.4)",
        color: "#FF8056",
        fontFamily: "var(--font-space)",
      }}
    >
      YC {batch}
    </span>
  );
}

// ── CompanyLogo ────────────────────────────────────────────────
function CompanyLogo({ node }: { node: Node }) {
  const bg = INDUSTRY_BG[node.industry];
  const color = INDUSTRY_COLORS[node.industry] ?? INDUSTRY_COLORS["Default"];
  if (bg) {
    return (
      <div
        className="w-16 h-16 rounded-2xl overflow-hidden flex items-center justify-center shadow-lg bg-cover bg-center"
        style={{ backgroundImage: `url(${bg})`, border: `1.5px solid ${color}40` }}
      >
        <span className="text-3xl font-bold font-space text-white shadow-lg mix-blend-overlay opacity-80">{node.name.charAt(0)}</span>
      </div>
    );
  }
  return (
    <div
      className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold shadow-lg"
      style={{
        background: `linear-gradient(135deg, ${color}30, ${color}10)`,
        border: `1.5px solid ${color}40`,
        color,
        fontFamily: "var(--font-space)",
      }}
    >
      {node.name.charAt(0)}
    </div>
  );
}

// ── SimilarCard ────────────────────────────────────────────────
function SimilarCard({ node, onClick }: { node: Node; onClick: () => void }) {
  const [failed, setFailed] = useState(false);
  const color = INDUSTRY_COLORS[node.industry] ?? INDUSTRY_COLORS["Default"];
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-xl transition-all group"
      style={{
        background: "rgba(8,20,50,0.6)",
        border: "1px solid rgba(100,140,255,0.08)",
      }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(100,140,255,0.22)")}
      onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(100,140,255,0.08)")}
    >
      {/* Mini logo */}
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 overflow-hidden bg-cover bg-center"
        style={{
          backgroundImage: INDUSTRY_BG[node.industry] ? `url(${INDUSTRY_BG[node.industry]})` : undefined,
          background: INDUSTRY_BG[node.industry] ? undefined : `${color}25`,
        }}
      >
        <span className="text-sm font-bold mix-blend-overlay opacity-80" style={{ color: INDUSTRY_BG[node.industry] ? "white" : color }}>{node.name.charAt(0)}</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold truncate" style={{ color: "var(--text)", fontFamily: "var(--font-space)" }}>
          {node.name}
        </div>
        <div className="text-xs" style={{ color: "var(--text-muted)" }}>{node.industry} · {node.batch}</div>
      </div>
      <ArrowRight className="w-3.5 h-3.5 shrink-0 opacity-0 group-hover:opacity-70 transition-opacity" style={{ color: "var(--text-sec)" }} />
    </button>
  );
}

// ── Main Sidebar ───────────────────────────────────────────────
export default function Sidebar() {
  const { selectedNode, setSelectedNode, nodes } = useStore();

  const similar = nodes
    .filter(n => n.industry === selectedNode?.industry && n.id !== selectedNode?.id)
    .slice(0, 4);

  const color = INDUSTRY_COLORS[selectedNode?.industry ?? ""] ?? INDUSTRY_COLORS["Default"];
  const tags = parseTags(selectedNode?.tags);

  return (
    <AnimatePresence>
      {selectedNode && (
        <motion.aside
          key={selectedNode.id}
          initial={{ x: -420, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -420, opacity: 0 }}
          transition={{ type: "spring", stiffness: 340, damping: 36 }}
          className="absolute left-0 top-0 bottom-0 z-30 flex flex-col"
          style={{
            width: 360,
            background: "rgba(4,12,30,0.97)",
            borderRight: "1px solid rgba(100,140,255,0.12)",
            backdropFilter: "blur(32px)",
            overflowY: "auto",
          }}
        >
          {/* Header gradient strip */}
          <div
            className="relative h-40 shrink-0 bg-cover bg-center"
            style={{
              backgroundImage: INDUSTRY_BG[selectedNode.industry] ? `linear-gradient(to bottom, rgba(4,12,30,0.4) 0%, rgba(4,12,30,0.95) 100%), url(${INDUSTRY_BG[selectedNode.industry]})` : `linear-gradient(135deg, ${color}18 0%, rgba(4,12,30,0) 100%)`,
              borderBottom: `1px solid ${color}20`,
            }}
          >
            {/* Close */}
            <button
              onClick={() => setSelectedNode(null)}
              className="absolute top-4 right-4 p-2 rounded-xl transition-colors flex items-center justify-center"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
              onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.12)")}
              onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.06)")}
            >
              <X className="w-4 h-4" style={{ color: "var(--text-sec)" }} />
            </button>

            {/* Logo + name row */}
            <div className="absolute bottom-0 left-0 right-0 px-5 pb-4 flex items-end gap-4">
              <CompanyLogo node={selectedNode} />
              <div className="flex-1 min-w-0 pb-1">
                <h2
                  className="text-xl font-bold leading-tight truncate"
                  style={{ color: "var(--text)", fontFamily: "var(--font-space)" }}
                >
                  {selectedNode.name}
                </h2>
                <a
                  href={selectedNode.website}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs mt-0.5 transition-colors"
                  style={{ color: "var(--text-muted)", fontFamily: "var(--font-inter)" }}
                  onMouseEnter={e => (e.currentTarget.style.color = color)}
                  onMouseLeave={e => (e.currentTarget.style.color = "var(--text-muted)")}
                >
                  {getDomain(selectedNode.website)}
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 px-5 py-5 space-y-6">

            {/* Badges row */}
            <div className="flex items-center gap-2 flex-wrap">
              <IndustryBadge industry={selectedNode.industry} />
              <BatchBadge batch={selectedNode.batch} />
            </div>

            {/* About */}
            <div>
              <div
                className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest mb-2"
                style={{ color: "var(--text-muted)", fontFamily: "var(--font-space)" }}
              >
                <Sparkles className="w-3 h-3" /> About
              </div>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "var(--text-sec)", fontFamily: "var(--font-inter)" }}
              >
                {selectedNode.description}
              </p>
            </div>

            {/* Meta pills */}
            <div className="grid grid-cols-2 gap-3">
              <div
                className="rounded-xl px-3 py-3"
                style={{ background: "rgba(8,20,50,0.7)", border: "1px solid rgba(100,140,255,0.08)" }}
              >
                <div className="flex items-center gap-1.5 mb-1" style={{ color: "var(--text-muted)" }}>
                  <Building2 className="w-3 h-3" />
                  <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ fontFamily: "var(--font-space)" }}>Industry</span>
                </div>
                <div className="text-sm font-semibold" style={{ color, fontFamily: "var(--font-space)" }}>{selectedNode.industry}</div>
              </div>
              <div
                className="rounded-xl px-3 py-3"
                style={{ background: "rgba(8,20,50,0.7)", border: "1px solid rgba(100,140,255,0.08)" }}
              >
                <div className="flex items-center gap-1.5 mb-1" style={{ color: "var(--text-muted)" }}>
                  <Calendar className="w-3 h-3" />
                  <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ fontFamily: "var(--font-space)" }}>Batch</span>
                </div>
                <div className="text-sm font-semibold" style={{ color: "#FF8056", fontFamily: "var(--font-space)" }}>{selectedNode.batch}</div>
              </div>
            </div>

            {/* Tags */}
            {tags.length > 0 && (
              <div>
                <div
                  className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest mb-2"
                  style={{ color: "var(--text-muted)", fontFamily: "var(--font-space)" }}
                >
                  <Hash className="w-3 h-3" /> Tags
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {tags.map((t: string) => (
                    <span
                      key={t}
                      className="px-2.5 py-1 rounded-full text-xs capitalize"
                      style={{
                        background: "rgba(100,140,255,0.08)",
                        border: "1px solid rgba(100,140,255,0.15)",
                        color: "var(--text-sec)",
                        fontFamily: "var(--font-inter)",
                      }}
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Website CTA */}
            <a
              href={selectedNode.website}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold transition-all"
              style={{
                background: color + "18",
                border: `1px solid ${color}40`,
                color,
                fontFamily: "var(--font-space)",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = color + "28";
                e.currentTarget.style.boxShadow = `0 0 20px ${color}25`;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = color + "18";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <ExternalLink className="w-4 h-4" />
              Visit {selectedNode.name}
            </a>

            {/* Similar companies */}
            {similar.length > 0 && (
              <div>
                <div
                  className="text-[10px] font-semibold uppercase tracking-widest mb-3"
                  style={{ color: "var(--text-muted)", fontFamily: "var(--font-space)" }}
                >
                  Similar Companies
                </div>
                <div className="space-y-2">
                  {similar.map(n => (
                    <SimilarCard key={n.id} node={n} onClick={() => setSelectedNode(n)} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
