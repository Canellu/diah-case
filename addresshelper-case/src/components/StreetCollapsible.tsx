"use client";

import { getStreetNumbers } from "@/app/actions/getStreetNumber";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { CountryCode } from "@/types/countryCode";
import { StreetNumber } from "@/types/streetNumber";
import { LoaderCircle } from "lucide-react";
import { useState } from "react";
import StreetNumberCollapsible from "./StreetNumberCollapsible";

interface StreetCollapsibleProps {
  street: {
    streetName: string;
    city: string;
    streetIds: number[];
  };
  streetNumbersById: {
    [key: number]: StreetNumber[];
  };
  countryCode: CountryCode;
  onFetch: (ids: number[], numbers: Record<number, StreetNumber[]>) => void;
}

function StreetCollapsible({
  street,
  streetNumbersById,
  countryCode,
  onFetch,
}: StreetCollapsibleProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetchStreetNumbers = async (
    streetIds: number[]
  ): Promise<Record<number, StreetNumber[]>> => {
    try {
      const numbers = await getStreetNumbers(streetIds, countryCode);
      const grouped: Record<number, StreetNumber[]> = {};
      for (const sn of numbers) {
        for (const id of streetIds) {
          if (!grouped[id]) grouped[id] = [];
          grouped[id].push(sn);
        }
      }
      return grouped;
    } catch (e) {
      console.error("Street number fetch error:", e);
      return {};
    }
  };

  const handleToggle = async () => {
    if (isOpen) {
      setIsOpen(false);
      return;
    }

    setIsOpen(true);

    // Check if already have numbers cached for any of the streetIds
    const hasFetched = street.streetIds.some((id) => streetNumbersById[id]);
    if (!hasFetched) {
      setIsLoading(true);
      try {
        const fetched = await fetchStreetNumbers(street.streetIds);
        onFetch(street.streetIds, fetched);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const allStreetNumbersMap = new Map<string, StreetNumber>();

  street.streetIds.forEach((id) => {
    (streetNumbersById[id] || []).forEach((sn) => {
      const key = `${sn.streetNo}-${sn.deliveryPointId}`;
      if (!allStreetNumbersMap.has(key)) {
        allStreetNumbersMap.set(key, sn);
      }
    });
  });

  const allStreetNumbers = Array.from(allStreetNumbersMap.values());
  return (
    <li className="border-b">
      <Collapsible open={isOpen} onOpenChange={handleToggle}>
        <CollapsibleTrigger asChild>
          <div
            className={cn(
              `group p-3 w-full flex justify-between items-center cursor-pointer hover:bg-blue-50 transition`,
              isLoading ? "opacity-50 pointer-events-none" : ""
            )}
          >
            <span className="font-medium">
              {street.streetName}, {street.city}
            </span>
            <span className="text-sm text-neutral-600">
              {isLoading ? (
                <div>
                  <LoaderCircle className="animate-spin w-4 h-4 mr-2" />
                  <span>Loading...</span>
                </div>
              ) : isOpen ? (
                "Hide"
              ) : (
                <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  Show street numbers
                </span>
              )}
            </span>
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent>
          {isLoading && "Loading..."}

          {!isLoading && allStreetNumbers.length === 0 && (
            <div className="text-sm italic text-neutral-600 px-4 py-2">
              No street numbers found.
            </div>
          )}

          {!isLoading && allStreetNumbers.length > 0 && (
            <ul className="pl-6 pr-4 pb-4 space-y-1 text-sm">
              {allStreetNumbers.map((streetNumber) => (
                <li
                  key={JSON.stringify(streetNumber)}
                  className="text-neutral-700 border-b"
                >
                  <StreetNumberCollapsible
                    streetNumber={streetNumber}
                    countryCode={countryCode}
                  />
                </li>
              ))}
            </ul>
          )}
        </CollapsibleContent>
      </Collapsible>
    </li>
  );
}

export default StreetCollapsible;
