export type Street = {
  countryCode: string;
  city: string;
  streetName: string;
  streetIds: number[];
  isAliasMatch: string; // Unsure what this is. Not documented in DIAH.
};

export type StreetSearchResponse = {
  streets: Street[];
  totalResults: number;
};
