"use client";

import { Plus, Minus, RotateCcw, Maximize } from "lucide-react";

const BTN_STYLE: React.CSSProperties = {
  width: 38,
  height: 38,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "rgba(4,12,30,0.92)",
  border: "1px solid rgba(100,140,255,0.14)",
  backdropFilter: "blur(20px)",
  color: "var(--text-sec)",
  cursor: "pointer",
  transition: "all 0.18s",
};

interface Props {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
}

export default function MapControls({ onZoomIn, onZoomOut, onReset }: Props) {
  const hover = (e: React.MouseEvent<HTMLButtonElement>, enter: boolean) => {
    e.currentTarget.style.background = enter ? "rgba(8,22,60,0.98)" : "rgba(4,12,30,0.92)";
    e.currentTarget.style.color = enter ? "var(--text)" : "var(--text-sec)";
    e.currentTarget.style.borderColor = enter ? "rgba(100,140,255,0.3)" : "rgba(100,140,255,0.14)";
  };

  return (
    <div
      className="flex flex-col rounded-2xl overflow-hidden shadow-2xl"
      style={{ gap: 1, background: "rgba(100,140,255,0.06)" }}
    >
      <button
        style={{ ...BTN_STYLE, borderRadius: "14px 14px 0 0" }}
        onClick={onZoomIn}
        onMouseEnter={e => hover(e, true)}
        onMouseLeave={e => hover(e, false)}
        title="Zoom in"
      >
        <Plus className="w-4 h-4" />
      </button>
      <button
        style={{ ...BTN_STYLE, borderRadius: 0 }}
        onClick={onZoomOut}
        onMouseEnter={e => hover(e, true)}
        onMouseLeave={e => hover(e, false)}
        title="Zoom out"
      >
        <Minus className="w-4 h-4" />
      </button>
      <button
        style={{ ...BTN_STYLE, borderRadius: "0 0 14px 14px" }}
        onClick={onReset}
        onMouseEnter={e => hover(e, true)}
        onMouseLeave={e => hover(e, false)}
        title="Reset view"
      >
        <RotateCcw className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
