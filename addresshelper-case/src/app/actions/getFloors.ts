"use server";

import { CountryCode } from "@/types/countryCode";
import { Floor } from "@/types/floor";

export async function getFloors(
  deliveryPointId: number,
  countryCode: CountryCode = CountryCode.Norway
): Promise<Floor[]> {
  const apiKey = process.env.DI_API_KEY;
  if (!apiKey) throw new Error("Missing API key");

  const baseUrl = process.env.DIAH_BASE_URL;
  if (!baseUrl) throw new Error("Missing base URL");

  const referer = process.env.DI_REFERRER;
  if (!referer) throw new Error("Missing referer");

  const url = new URL(
    `${baseUrl}/${countryCode}/address/${deliveryPointId}/floors`
  );

  const params = new URLSearchParams({
    apiKey,
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

  return data as Floor[];
}
