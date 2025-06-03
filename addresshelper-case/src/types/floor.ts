import { Household } from "./household";

export const FloorType = {
  Main: { code: "H", description: "Hovedetasje - main floor" },
  Basement: { code: "K", description: "Kjeller - basement" },
  Loft: { code: "L", description: "Loft - attic/loft" },
  LowerGround: { code: "U", description: "Underetasje - lower ground floor" },
} as const;

export type FloorTypeCode = (typeof FloorType)[keyof typeof FloorType]["code"];

export type Floor = {
  floorType: FloorTypeCode; // The floor type represented by a single letter
  floorTypeName: string; // The full word of the floor type (in Norwegian) //FIXME: Does this work? Null returned for this field.
  floorNo: number;
};

export interface FloorWithHouseholds extends Floor {
  households: Household[];
}
