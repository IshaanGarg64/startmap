import { create } from "zustand";

export type Node = {
  id: string;
  name: string;
  description: string;
  industry: string;
  batch: string;
  website: string;
  tags: string; // JSON string
  val: number;
  x?: number;
  y?: number;
  z?: number;
  lat?: number;
  lng?: number;
  color?: string;
};

export type Link = {
  source: string | Node;
  target: string | Node;
  type: string;
  weight: number;
};

export const INDUSTRY_COLORS: Record<string, string> = {
  AI:         "#A78BFA",
  Fintech:    "#22D3EE",
  SaaS:       "#818CF8",
  Consumer:   "#FB923C",
  Crypto:     "#FBBF24",
  Healthcare: "#34D399",
  Default:    "#94A3B8",
};

export const INDUSTRY_GLOW: Record<string, string> = {
  AI:         "#7C3AED",
  Fintech:    "#0E7490",
  SaaS:       "#4338CA",
  Consumer:   "#C2610C",
  Crypto:     "#B45309",
  Healthcare: "#059669",
  Default:    "#475569",
};

export const INDUSTRY_BG: Record<string, string> = {
  AI:         "/images/ai.png",
  Fintech:    "/images/fintech.png",
  SaaS:       "/images/saas.png",
  Consumer:   "/images/consumer.png",
  Crypto:     "/images/crypto.png",
};

interface StoreState {
  nodes: Node[];
  links: Link[];
  filteredNodes: Node[];
  filteredLinks: Link[];
  selectedNode: Node | null;
  hoveredNode: Node | null;
  searchQuery: string;
  industryFilter: string;
  isLoading: boolean;
  fetchData: () => Promise<void>;
  setSelectedNode: (node: Node | null) => void;
  setHoveredNode: (node: Node | null) => void;
  setSearchQuery: (query: string) => void;
  setIndustryFilter: (industry: string) => void;
  applyFilters: () => void;
}

// Simple deterministic hash to pseudo-random value [0, 1]
function hashIdToFloat(id: string, seed: number = 0): number {
  let h = 0x811c9dc5 + seed;
  for (let i = 0; i < id.length; i++) {
    h ^= id.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return ((h >>> 0) / 4294967296);
}

export const useStore = create<StoreState>((set, get) => ({
  nodes: [],
  links: [],
  filteredNodes: [],
  filteredLinks: [],
  selectedNode: null,
  hoveredNode: null,
  searchQuery: "",
  industryFilter: "All",
  isLoading: true,

  fetchData: async () => {
    try {
      const res = await fetch("/api/data");
      const data = await res.json();
      const colored = data.nodes.map((n: Node) => {
        // Distribute heavily in tech hubs (US, Europe, India, etc.) loosely based on id
        const baseLng = (hashIdToFloat(n.id, 1) * 360) - 180;
        const baseLat = (hashIdToFloat(n.id, 2) * 140) - 70; // Avoid extreme poles

        return {
          ...n,
          color: INDUSTRY_COLORS[n.industry] ?? INDUSTRY_COLORS["Default"],
          lat: baseLat,
          lng: baseLng,
        };
      });
      set({ nodes: colored, links: data.links, filteredNodes: colored, filteredLinks: data.links, isLoading: false });
    } catch (e) {
      console.error(e);
      set({ isLoading: false });
    }
  },

  setSelectedNode: (node) => set({ selectedNode: node }),
  setHoveredNode: (node) => set({ hoveredNode: node }),

  setSearchQuery: (query) => {
    set({ searchQuery: query });
    get().applyFilters();
  },

  setIndustryFilter: (industry) => {
    set({ industryFilter: industry });
    get().applyFilters();
  },

  applyFilters: () => {
    const { nodes, links, searchQuery, industryFilter } = get();
    let fNodes = nodes;
    if (searchQuery) fNodes = fNodes.filter(n => n.name.toLowerCase().includes(searchQuery.toLowerCase()));
    if (industryFilter !== "All") fNodes = fNodes.filter(n => n.industry === industryFilter);
    const validIds = new Set(fNodes.map(n => n.id));
    const fLinks = links.filter(l => {
      const s = typeof l.source === "object" ? l.source.id : l.source;
      const t = typeof l.target === "object" ? l.target.id : l.target;
      return validIds.has(s) && validIds.has(t);
    });
    set({ filteredNodes: fNodes, filteredLinks: fLinks });
  },
}));
