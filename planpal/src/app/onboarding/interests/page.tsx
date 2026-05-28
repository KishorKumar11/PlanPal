"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import InterestGrid from "@/components/InterestGrid";

export default function InterestsPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (selected.length < 3) return;
    setSaving(true);
    await fetch("/api/interests", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ interests: selected }),
    });
    router.push("/dashboard");
  };

  return (
    <main className="min-h-screen px-4 py-16">
      <div className="mx-auto max-w-2xl">
        <div className="mb-10">
          <h1 className="font-display text-4xl font-bold gradient-text mb-2">
            What gets you excited?
          </h1>
          <p className="text-text-dim">
            Pick your interests — this helps us find the perfect activities for your group.
          </p>
        </div>

        <InterestGrid onChange={setSelected} />

        <div className="mt-10 flex justify-end">
          <button
            onClick={handleSave}
            disabled={selected.length < 3 || saving}
            className="rounded-full bg-gradient-vibe px-8 py-3 font-semibold text-white disabled:opacity-40 hover:opacity-90 transition-opacity"
          >
            {saving ? "Saving…" : "Save & Continue →"}
          </button>
        </div>
      </div>
    </main>
  );
}
