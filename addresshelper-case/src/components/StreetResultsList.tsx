import { CountryCode } from "@/types/countryCode";
import { StreetSearchResponse } from "@/types/street";
import { StreetNumber } from "@/types/streetNumber";
import { useEffect, useState } from "react";
import StreetCollapsible from "./StreetCollapsible";

interface Props {
  addresses: { id: string; value: string }[];
  results: { id: string; response: StreetSearchResponse | null }[];
  countryCode: CountryCode;
}

export default function StreetResultsList({
  addresses,
  results,
  countryCode,
}: Props) {
  const [streetNumbersById, setStreetNumbersById] = useState<
    Record<number, StreetNumber[]>
  >({});

  useEffect(() => {
    console.log(streetNumbersById);
  }, [streetNumbersById]);

  const handleFetchedNumbers = (
    streetIds: number[],
    fetchedNumbers: Record<number, StreetNumber[]>
  ) => {
    setStreetNumbersById((prev) => {
      const updated = { ...prev };
      for (const id of streetIds) {
        if (fetchedNumbers[id]) {
          updated[id] = fetchedNumbers[id];
        }
      }
      return updated;
    });
  };

  return (
    <div className="border overflow-y-auto h-full rounded-md bg-muted">
      {results.length === 0 ? (
        <div className="text-neutral-500 italic px-4 py-2">
          No street results yet.
        </div>
      ) : (
        results.map(({ id, response }) => {
          const address = addresses.find((a) => a.id === id);
          if (!response || response.totalResults === 0) {
            return (
              <div
                key={id}
                className="p-4 border rounded bg-red-50 text-red-700"
              >
                No results for address: <strong>{address?.value}</strong>
              </div>
            );
          }

          return (
            <div key={id}>
              <h3 className="flex items-center justify-between sticky top-0 bg-neutral-200 py-2 px-4 rounded-t text-sm font-medium">
                <span>
                  Results for:{" "}
                  <span className="text-blue-700 font-semibold">
                    {address?.value}
                  </span>
                </span>
                <span className="text-neutral-600">
                  {response.streets.length} street
                  {response.streets.length !== 1 ? "s" : ""} found
                </span>
              </h3>

              <ul className="flex flex-col">
                {response.streets.map((street) => (
                  <StreetCollapsible
                    key={`${street.streetName}-${street.city}`}
                    street={street}
                    countryCode={countryCode}
                    streetNumbersById={streetNumbersById}
                    onFetch={handleFetchedNumbers}
                  />
                ))}
              </ul>
            </div>
          );
        })
      )}
    </div>
  );
}
