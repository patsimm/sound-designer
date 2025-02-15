import { ColorJson } from "color";

export const ENTITY_NODE = "node" as const;
export const ENTITY_SELECTION_ANCHOR = "selection-anchor" as const;
export const ENTITY_NODE_SKELETON = "node-skeleton";

const entityTypes = [
  ENTITY_NODE,
  ENTITY_SELECTION_ANCHOR,
  ENTITY_NODE_SKELETON,
] as const;

export type EntityType = (typeof entityTypes)[number];

export const isEntityType = (input: string): input is EntityType =>
  (entityTypes as readonly string[]).includes(input);

export const isElementOfEntityType = (el: Element, type: EntityType) => {
  const entityType = el.getAttribute("data-entitytype");
  if (!entityType || !isEntityType(entityType)) return false;
  return entityType === type;
};

export const entityTypeProps = (entityType: EntityType) => ({
  "data-entitytype": entityType,
});

export type Rect = {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: ColorJson;
};

export type EditorNode = Rect;
