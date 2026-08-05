export type LabTone = "instant" | "blocking" | "cached";

/**
 * Literal class strings so Tailwind's scanner can see them. Each demo pane owns
 * one hue, which is what lets a side-by-side comparison read before you get to
 * the numbers.
 */
export const TONE_BAR: Record<LabTone, string> = {
  instant: "bg-lab-instant",
  blocking: "bg-lab-blocking",
  cached: "bg-lab-cached",
};

export const TONE_TEXT: Record<LabTone, string> = {
  instant: "text-lab-instant",
  blocking: "text-lab-blocking",
  cached: "text-lab-cached",
};

export const TONE_BORDER: Record<LabTone, string> = {
  instant: "border-lab-instant/35",
  blocking: "border-lab-blocking/35",
  cached: "border-lab-cached/35",
};

export const TONE_GLOW: Record<LabTone, string> = {
  instant: "bg-lab-instant-muted",
  blocking: "bg-lab-blocking-muted",
  cached: "bg-lab-cached-muted",
};
