const anchorDirections = ["ne", "nw", "se", "sw"] as const;
export type AnchorDirection = (typeof anchorDirections)[number];

export const isAnchorDirection = (input: string): input is AnchorDirection =>
  (anchorDirections as readonly string[]).includes(input);

export const horizontalSign = (dir: AnchorDirection) =>
  dir.charAt(1) === "e" ? 1 : -1;
export const verticalSign = (dir: AnchorDirection) =>
  dir.charAt(0) === "s" ? 1 : -1;
