"use client";

import { useStore, INDUSTRY_COLORS } from "@/store/useStore";
import { Search, X } from "lucide-react";
import { useRef } from "react";

const INDUSTRIES = ["All", "AI", "Fintech", "SaaS", "Consumer", "Crypto", "Healthcare"];

export default function SearchPanel() {
  const { searchQuery, setSearchQuery, industryFilter, setIndustryFilter, filteredNodes, nodes } = useStore();
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-col gap-2 w-full" style={{ fontFamily: "var(--font-space, sans-serif)" }}>
      {/* Search Bar */}
      <div
        className="flex items-center gap-3 px-4 py-3 rounded-2xl shadow-2xl"
        style={{
          background: "rgba(6,18,44,0.96)",
          border: "1px solid rgba(100,140,255,0.18)",
          backdropFilter: "blur(28px)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(100,140,255,0.06) inset",
        }}
      >
        <Search className="w-[18px] h-[18px] shrink-0" style={{ color: "var(--accent)" }} />
        <input
          ref={inputRef}
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search companies, industries..."
          className="flex-1 bg-transparent outline-none text-sm font-medium placeholder-opacity-50"
          style={{ color: "var(--text)", fontFamily: "var(--font-inter, sans-serif)" }}
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="p-1 rounded-full transition-colors shrink-0"
            style={{ color: "var(--text-muted)" }}
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Filter pills */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {INDUSTRIES.map(ind => {
          const active = industryFilter === ind;
          const color = ind === "All" ? "#FF6130" : (INDUSTRY_COLORS[ind] ?? "#94A3B8");
          return (
            <button
              key={ind}
              onClick={() => setIndustryFilter(ind)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
              style={{
                fontFamily: "var(--font-space, sans-serif)",
                background: active
                  ? color + "26"
                  : "rgba(6,16,38,0.85)",
                border: `1px solid ${active ? color + "66" : "rgba(100,140,255,0.12)"}`,
                color: active ? color : "var(--text-muted)",
                backdropFilter: "blur(12px)",
                boxShadow: active ? `0 0 12px ${color}30` : "none",
                transform: active ? "scale(1.04)" : "scale(1)",
              }}
            >
              {ind !== "All" && (
                <span
                  className="inline-block w-1.5 h-1.5 rounded-full"
                  style={{ background: color }}
                />
              )}
              {ind}
            </button>
          );
        })}
      </div>

      {/* Results count */}
      {(searchQuery || industryFilter !== "All") && (
        <div
          className="px-3 py-1.5 rounded-xl text-xs"
          style={{
            background: "rgba(6,16,38,0.75)",
            border: "1px solid rgba(100,140,255,0.08)",
            color: "var(--text-muted)",
            fontFamily: "var(--font-inter)",
            backdropFilter: "blur(12px)",
          }}
        >
          Showing <span style={{ color: "var(--accent)", fontWeight: 600 }}>{filteredNodes.length}</span> of {nodes.length} companies
        </div>
      )}
    </div>
  );
}
