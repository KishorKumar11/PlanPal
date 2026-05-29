"use client";

import { useState } from "react";
import { Check, Link2 } from "lucide-react";

export default function CopyInviteButton({ inviteUrl }: { inviteUrl: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={copy}
      className="flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-sm text-text-dim hover:border-violet/40 hover:text-text-bright transition-all"
    >
      {copied ? <Check size={15} /> : <Link2 size={15} />}
      {copied ? "Copied!" : "Copy invite link"}
    </button>
  );
}
