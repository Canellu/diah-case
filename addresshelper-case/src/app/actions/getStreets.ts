"use server";

import { CountryCode } from "@/types/countryCode";
import { StreetSearchResponse } from "@/types/street";

export async function getStreets(
  streetName: string,
  countryCode: CountryCode = CountryCode.Norway
): Promise<StreetSearchResponse> {
  const apiKey = process.env.DI_API_KEY;
  if (!apiKey) throw new Error("Missing API key");

  const baseUrl = process.env.DIAH_BASE_URL;
  if (!baseUrl) throw new Error("Missing base URL");

  const referer = process.env.DI_REFERRER;
  if (!referer) throw new Error("Missing referer");

  const encodedStreet = encodeURIComponent(streetName);

  const url = new URL(
    `${baseUrl}/${countryCode}/streetSearch/${encodedStreet}`
  );

  const params = new URLSearchParams({
    apiKey,
    // location: "oslo", // To show street name from relevant city first. If you want to show the streets in the user's city first in the result, you will have to use a service to find the city of the user's IP address. For common street names this is useful (i.e. Kirkegata, Skoleveien or Storgata)
    limitToOfficial: "true", // If you want to limit the results to official Norwegian addresses (will eliminate duplicates). Default is false
    // limit: "300", // If you want to override the number of records to return. Default is 30, and max is 300.
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

  const data = (await res.json()) as StreetSearchResponse;

  return data;
}
