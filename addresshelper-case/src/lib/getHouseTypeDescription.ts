import { HouseType, HouseTypeCode } from "@/types/streetNumber";

export function getHouseTypeDescription(code: HouseTypeCode): string {
  const match = Object.values(HouseType).find((type) => type.code === code);
  return match ? match.description : "Unknown";
}
