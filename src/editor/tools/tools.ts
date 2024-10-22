export const TOOL_MOVE = "move";
export const TOOL_ADD_NODE = "add-node";

const toolTypes = [TOOL_MOVE, TOOL_ADD_NODE] as const;

export type ToolType = (typeof toolTypes)[number];

export const isToolType = (input: string): input is ToolType =>
  (toolTypes as readonly string[]).includes(input);
