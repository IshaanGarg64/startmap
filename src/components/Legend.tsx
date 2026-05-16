"use client";

import { useStore, INDUSTRY_COLORS } from "@/store/useStore";

const INDUSTRIES = ["AI", "Fintech", "SaaS", "Consumer", "Crypto", "Healthcare"];

export default function Legend() {
  const { nodes, industryFilter, setIndustryFilter } = useStore();

  const counts: Record<string, number> = {};
  nodes.forEach(n => {
    counts[n.industry] = (counts[n.industry] ?? 0) + 1;
  });

  return (
    <div
      className="rounded-2xl px-4 py-3 flex flex-col gap-2"
      style={{
        background: "rgba(4,12,30,0.88)",
        border: "1px solid rgba(100,140,255,0.10)",
        backdropFilter: "blur(20px)",
        minWidth: 150,
      }}
    >
      <div
        className="text-[9px] font-bold uppercase tracking-widest mb-1"
        style={{ color: "var(--text-muted)", fontFamily: "var(--font-space)" }}
      >
        Industries
      </div>
      {INDUSTRIES.map(ind => {
        const color = INDUSTRY_COLORS[ind];
        const active = industryFilter === ind;
        return (
          <button
            key={ind}
            onClick={() => setIndustryFilter(active ? "All" : ind)}
            className="flex items-center gap-2.5 group"
          >
            <span
              className="w-2 h-2 rounded-full shrink-0 transition-transform group-hover:scale-125"
              style={{ background: color, boxShadow: `0 0 6px ${color}` }}
            />
            <span
              className="text-xs font-medium flex-1 text-left"
              style={{
                color: active ? color : "var(--text-sec)",
                fontFamily: "var(--font-inter)",
                fontWeight: active ? 600 : 400,
              }}
            >
              {ind}
            </span>
            <span
              className="text-[10px] tabular-nums"
              style={{ color: "var(--text-muted)" }}
            >
              {counts[ind] ?? 0}
            </span>
          </button>
        );
      })}
    </div>
  );
}
