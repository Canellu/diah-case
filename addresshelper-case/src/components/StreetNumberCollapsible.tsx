"use client";

import { getFloors } from "@/app/actions/getFloors";
import { getHouseholds } from "@/app/actions/getHouseholds";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useMapContext } from "@/context/MapContext";
import { getFloorTypeDescription } from "@/lib/getFloorTypeDescription";
import { getHouseTypeDescription } from "@/lib/getHouseTypeDescription";
import { cn } from "@/lib/utils";
import { CountryCode } from "@/types/countryCode";
import { FloorWithHouseholds } from "@/types/floor";
import { StreetNumber } from "@/types/streetNumber";
import { LoaderCircle } from "lucide-react";
import { useState } from "react";

interface Props {
  streetNumber: StreetNumber;
  countryCode: CountryCode;
}

export default function StreetNumberCollapsible({
  streetNumber,
  countryCode,
}: Props) {
  const { setLocation } = useMapContext();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [floorsByDeliveryPoint, setFloorsByDeliveryPoint] = useState<
    Record<number, FloorWithHouseholds[]>
  >({});

  const fetchFloorsAndHouseholds = async (deliveryPointId: number) => {
    if (floorsByDeliveryPoint[deliveryPointId]) return;

    setIsLoading(true);
    try {
      const floors = await getFloors(deliveryPointId, countryCode);
      const enriched = await Promise.all(
        floors.map(async (floor) => {
          const households = await getHouseholds(
            deliveryPointId,
            floor.floorType,
            floor.floorNo,
            countryCode
          );
          return { ...floor, households };
        })
      );

      setFloorsByDeliveryPoint((prev) => ({
        ...prev,
        [deliveryPointId]: enriched,
      }));
    } catch (e) {
      console.error("Error fetching floors/households:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle = async (open: boolean) => {
    setIsOpen(open);
    if (open) {
      await fetchFloorsAndHouseholds(streetNumber.deliveryPointId);
    }
  };

  const floors = floorsByDeliveryPoint[streetNumber.deliveryPointId] || [];

  return (
    <Collapsible open={isOpen} onOpenChange={handleToggle}>
      <CollapsibleTrigger
        asChild
        onClick={() => {
          if (streetNumber.latitude && streetNumber.longitude) {
            setLocation({
              lat: streetNumber.latitude,
              lng: streetNumber.longitude,
            });
          }
        }}
      >
        <div
          className={cn(
            "p-2 cursor-pointer flex justify-between items-center hover:bg-neutral-100 transition"
          )}
        >
          <div>
            <span className="font-medium">
              {streetNumber.streetNo}
              {streetNumber.entrance && `(${streetNumber.entrance})`}
            </span>{" "}
            – {streetNumber.postalCode}
            <div className="text-xs text-neutral-600">
              {getHouseTypeDescription(streetNumber.houseType)}
            </div>
          </div>
          <span className="text-xs text-neutral-600">
            {isLoading ? (
              <LoaderCircle className="animate-spin w-4 h-4" />
            ) : isOpen ? (
              "Hide"
            ) : (
              "Show floors"
            )}
          </span>
        </div>
      </CollapsibleTrigger>

      <CollapsibleContent className="pl-4 pb-3">
        {isLoading && (
          <div className="text-sm italic text-neutral-600">
            <LoaderCircle className="animate-spin w-4 h-4 mr-2" />
            Loading...
          </div>
        )}
        {!isLoading && floors.length === 0 && (
          <div className="text-sm italic text-neutral-600">
            No floors/households found.
          </div>
        )}
        {!isLoading && floors.length > 0 && (
          <ul className="space-y-1 text-sm text-neutral-700">
            {floors.map((floor) => (
              <li key={`${floor.floorType}-${floor.floorNo}`}>
                <div className="font-medium">
                  Floor {floor.floorNo} (
                  {getFloorTypeDescription(floor.floorType)})
                </div>
                {floor.households.length > 0 ? (
                  <ul className="ml-4 list-disc text-xs">
                    {floor.households.map((hh) => {
                      return (
                        <li
                          key={`${hh.flatNo}-${hh.flatNoAlias}-${hh.deliveryPointId}`}
                        >
                          {hh.flatNoAlias || hh.flatNo}
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <div className="ml-4 text-xs text-neutral-500">
                    No households
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
}
