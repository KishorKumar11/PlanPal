interface PlanPalLogoProps {
  /** Controls the overall scale. The SVG icon scales proportionally. */
  size?: "sm" | "md" | "lg";
  /** Show the wordmark ("PlanPal") beside the icon */
  showWordmark?: boolean;
  /** Show the slogan below the wordmark */
  showSlogan?: boolean;
}

const sizeMap = {
  sm: { icon: 26, text: "text-xl",  slogan: "text-xs",  gap: "gap-2" },
  md: { icon: 36, text: "text-3xl", slogan: "text-sm",  gap: "gap-2.5" },
  lg: { icon: 52, text: "text-5xl", slogan: "text-base", gap: "gap-3" },
};

/** Three overlapping stickman heads — brand colours violet / pink / orange */
function GroupIcon({ size }: { size: number }) {
  // viewBox is 38 × 22; scale by (size / 22) to hit desired height
  const w = Math.round((size / 22) * 38);
  return (
    <svg
      width={w}
      height={size}
      viewBox="0 0 38 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Left head */}
      <circle cx="9"  cy="13" r="8" fill="#7c3aed" />
      {/* Centre head — slightly higher, slightly larger = focal point */}
      <circle cx="19" cy="10" r="9" fill="#ec4899" />
      {/* Right head */}
      <circle cx="29" cy="13" r="8" fill="#f97316" />
      {/* Thin white ring separators so overlaps read clearly at small sizes */}
      <circle cx="9"  cy="13" r="8" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
      <circle cx="19" cy="10" r="9" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
      <circle cx="29" cy="13" r="8" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
    </svg>
  );
}

export default function PlanPalLogo({
  size = "md",
  showWordmark = true,
  showSlogan = false,
}: PlanPalLogoProps) {
  const { icon, text, slogan, gap } = sizeMap[size];

  if (showSlogan) {
    // Stacked layout: icon + wordmark on one line, slogan below
    return (
      <div className="flex flex-col items-center gap-1">
        <div className={`flex items-center ${gap}`}>
          <GroupIcon size={icon} />
          {showWordmark && (
            <span className={`font-display ${text} font-bold gradient-text leading-none`}>
              PlanPal
            </span>
          )}
        </div>
        <p className={`text-white ${slogan} font-medium tracking-wide`}>
          Plans everyone actually loves.
        </p>
      </div>
    );
  }

  return (
    <div className={`flex items-center ${gap}`}>
      <GroupIcon size={icon} />
      {showWordmark && (
        <span className={`font-display ${text} font-bold gradient-text leading-none`}>
          PlanPal
        </span>
      )}
    </div>
  );
}
