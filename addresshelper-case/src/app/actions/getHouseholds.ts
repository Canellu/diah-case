"use server";

import { CountryCode } from "@/types/countryCode";
import { Household } from "@/types/household";

export async function getHouseholds(
  deliveryPointId: number,
  floorType: string,
  floorNo: number,
  countryCode: CountryCode = CountryCode.Norway
): Promise<Household[]> {
  const apiKey = process.env.DI_API_KEY;
  if (!apiKey) throw new Error("Missing API key");

  const baseUrl = process.env.DIAH_BASE_URL;
  if (!baseUrl) throw new Error("Missing base URL");

  const referer = process.env.DI_REFERRER;
  if (!referer) throw new Error("Missing referer");

  const url = new URL(
    `${baseUrl}/${countryCode}/address/${deliveryPointId}/floor/${floorType}-${floorNo}/households`
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

  const data = (await res.json()) as Household[];

  return data;
}
