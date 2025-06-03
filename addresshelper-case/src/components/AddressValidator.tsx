"use client";

import { useState } from "react";

import { CountryCode } from "@/types/countryCode";

import { MapProvider } from "@/context/MapContext";
import { StreetSearchResponse } from "@/types/street";
import AddressInputList from "./AddressInputList";
import Map from "./Map";
import StreetResultsList from "./StreetResultsList";

export default function AddressValidator() {
  const [addresses, setAddresses] = useState([{ id: "", value: "" }]);
  const [countryCode, setCountryCode] = useState<CountryCode>(
    CountryCode.Norway
  );

  const [streetsResponses, setStreetsResponses] = useState<
    { id: string; response: StreetSearchResponse | null }[]
  >([]);

  return (
    <MapProvider>
      <div className="h-full p-8 rounded-md shadow border bg-white grid grid-cols-2 grid-rows-5 gap-6">
        <div className="row-span-2">
          <AddressInputList
            addresses={addresses}
            setAddresses={setAddresses}
            setStreetsResponses={setStreetsResponses}
            countryCode={countryCode}
            onCountryChange={setCountryCode}
          />
        </div>
        <div className="border row-span-2 rounded-md">
          <Map />
        </div>

        <div className="col-span-2 row-span-3">
          <StreetResultsList
            addresses={addresses}
            results={streetsResponses}
            countryCode={countryCode}
          />
        </div>
      </div>
    </MapProvider>
  );
}
