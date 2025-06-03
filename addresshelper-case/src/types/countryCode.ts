export const CountryCode = {
  Norway: "NO",
  Sweden: "SE",
  Denmark: "DK",
  Finland: "FI",
  Iceland: "IS",
} as const;

export type CountryCode = (typeof CountryCode)[keyof typeof CountryCode];
