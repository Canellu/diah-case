"use server";

import { CountryCode } from "@/types/countryCode";
import { StreetNumber } from "@/types/streetNumber";

export async function getStreetNumbers(
  streetIds: number[],
  countryCode: CountryCode = CountryCode.Norway
): Promise<StreetNumber[]> {
  const apiKey = process.env.DI_API_KEY;
  if (!apiKey) throw new Error("Missing API key");

  const baseUrl = process.env.DIAH_BASE_URL;
  if (!baseUrl) throw new Error("Missing base URL");

  const referer = process.env.DI_REFERRER;
  if (!referer) throw new Error("Missing referer");

  const streetIdsParam = encodeURIComponent(streetIds.join(","));

  const url = new URL(
    `${baseUrl}/${countryCode}/streetNumberSearch/${streetIdsParam}`
  );

  const params = new URLSearchParams({
    apiKey,
    // streetNumber: "10", // Filter results by street number
    limitToOfficial: "true", // If you want to limit the results to official Norwegian addresses (will eliminate duplicates). Default is false
    // limit: "100", // If you want to override the number of records to return. Default is 30, and max is 300.
  });

  url.search = params.toString();

  const res = await fetch(url.toString(), {
    headers: {
      referer,
    },
  });

  if (!res.ok) {
    throw new Error(`DI API error: ${res.status}, message: ${res.statusText}`);
  }

  const data = await res.json();

  return data.streetNumbers as StreetNumber[];
}
