import { CountryCode } from "@/types/countryCode";

export function getCountryNameWithCode(code: CountryCode): string {
  const entry = Object.entries(CountryCode).find(([_, c]) => c === code);
  return entry ? `${entry[0]} (${entry[1]})` : code;
}
