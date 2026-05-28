"use client";

import { useState } from "react";
import InterestGrid from "@/components/InterestGrid";

export default function EditInterests({ initial }: { initial: string[] }) {
  const [selected, setSelected] = useState<string[]>(initial);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    if (selected.length < 3) return;
    setSaving(true);
    await fetch("/api/interests", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ interests: selected }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <InterestGrid initial={initial} onChange={setSelected} />
      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSave}
          disabled={selected.length < 3 || saving}
          className="rounded-full bg-gradient-vibe px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-40 hover:opacity-90 transition-opacity"
        >
          {saved ? "✓ Saved!" : saving ? "Saving…" : "Save interests"}
        </button>
      </div>
    </div>
  );
}
