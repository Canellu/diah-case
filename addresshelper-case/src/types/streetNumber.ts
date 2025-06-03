export const HouseType = {
  Detached: { code: "E", description: "Enebolig - detached house" },
  Row: { code: "R", description: "Rekkehus - row house" },
  Apartment: { code: "B", description: "Blokk - apartment building" },
  Business: { code: "F", description: "Forretning - business" },
  Holiday: { code: "H", description: "Hytte - holiday house" },
  Other: { code: "A", description: "Annet - other" },
} as const;

export type HouseTypeCode = (typeof HouseType)[keyof typeof HouseType]["code"];

export type StreetNumber = {
  streetNo: number;
  addressId: number;
  entrance?: string; // Present if a building has several entrances, where the value is the entrance name
  houseType: HouseTypeCode;
  deliveryPointId: number;
  postalCode: string;
  duplicateNumberAndEntrance: boolean; // Some streets have several entrances on the same street number. When duplicateNumberAndAddress is true, the houseType should be used to separate them
  latitude: number;
  longitude: number;
  showHouseholds: boolean; // True if households exists on houseType block
};
