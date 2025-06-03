import { FloorType, FloorTypeCode } from "@/types/floor";

export function getFloorTypeDescription(code: FloorTypeCode): string {
  const entry = Object.values(FloorType).find((ft) => ft.code === code);
  return entry ? entry.description : "Unknown floor type";
}
