"use client";

import { useRef, useState } from "react";
import { Share2, Check, Loader2 } from "lucide-react";

interface Props {
  groupName: string;
  title: string;
  category: string;
  dateLabel: string;
  appUrl: string;
}

const categoryColor: Record<string, string> = {
  activity: "#7c3aed",
  restaurant: "#ec4899",
  trip: "#f97316",
};

export default function SharePlanCard({
  groupName,
  title,
  category,
  dateLabel,
  appUrl,
}: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);

  const textSummary = `${groupName} is doing: ${title} (${category}) · ${dateLabel} · via PlanPal`;

  const copyText = async () => {
    try {
      await navigator.clipboard.writeText(textSummary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable — nothing more we can do */
    }
  };

  const share = async () => {
    if (!cardRef.current) return;
    setBusy(true);
    try {
      const { default: html2canvas } = await import("html2canvas");
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 2,
        logging: false,
      });
      const blob: Blob | null = await new Promise((resolve) =>
        canvas.toBlob((b) => resolve(b), "image/png")
      );
      if (!blob) return copyText();

      const file = new File([blob], "planpal-plan.png", { type: "image/png" });
      const canShareFile =
        typeof navigator.canShare === "function" &&
        navigator.canShare({ files: [file] });

      if (canShareFile) {
        await navigator.share({ files: [file], title: "Our PlanPal plan" });
      } else {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "planpal-plan.png";
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch {
      // Image capture failed (or share cancelled) — fall back to copying text.
      copyText();
    } finally {
      setBusy(false);
    }
  };

  const accent = categoryColor[category] ?? "#7c3aed";

  return (
    <div>
      <div className="flex gap-2">
        <button
          onClick={share}
          disabled={busy}
          className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-2 text-sm font-semibold text-text-bright hover:border-violet/50 transition-colors disabled:opacity-50"
        >
          {busy ? (
            <Loader2 size={15} className="animate-spin" />
          ) : (
            <Share2 size={15} />
          )}
          Share plan
        </button>
        <button
          onClick={copyText}
          className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-text-dim hover:text-text-bright transition-colors"
        >
          {copied ? <Check size={15} /> : null}
          {copied ? "Copied" : "Copy details"}
        </button>
      </div>

      {/* Off-screen capture target — inline hex styles so html2canvas can parse it. */}
      <div
        aria-hidden
        style={{ position: "absolute", left: "-9999px", top: 0 }}
      >
        <div
          ref={cardRef}
          style={{
            width: "600px",
            padding: "48px",
            boxSizing: "border-box",
            background: "linear-gradient(135deg, #1a1033 0%, #0a0618 100%)",
            fontFamily:
              "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
            color: "#f5f3ff",
          }}
        >
          <div
            style={{
              fontSize: "13px",
              letterSpacing: "2px",
              textTransform: "uppercase",
              color: "#a78bfa",
              marginBottom: "8px",
            }}
          >
            {groupName} is doing
          </div>
          <div
            style={{
              fontSize: "40px",
              fontWeight: 800,
              lineHeight: 1.1,
              marginBottom: "20px",
            }}
          >
            {title}
          </div>
          <div style={{ display: "flex", gap: "10px", marginBottom: "32px" }}>
            <span
              style={{
                fontSize: "14px",
                fontWeight: 600,
                padding: "6px 14px",
                borderRadius: "999px",
                background: `${accent}33`,
                color: accent,
                border: `1px solid ${accent}66`,
                textTransform: "capitalize",
              }}
            >
              {category}
            </span>
            <span
              style={{
                fontSize: "14px",
                fontWeight: 600,
                padding: "6px 14px",
                borderRadius: "999px",
                background: "rgba(255,255,255,0.06)",
                color: "#c4b5fd",
                border: "1px solid rgba(255,255,255,0.15)",
              }}
            >
              {dateLabel}
            </span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderTop: "1px solid rgba(255,255,255,0.1)",
              paddingTop: "20px",
            }}
          >
            <span style={{ fontSize: "18px", fontWeight: 800, color: "#f5f3ff" }}>
              PlanPal
            </span>
            <span style={{ fontSize: "13px", color: "#8b80a8" }}>{appUrl}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
