"use client";

import { getStreets } from "@/app/actions/getStreets";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CountryCode } from "@/types/countryCode";
import { StreetSearchResponse } from "@/types/street";
import { Minus, Plus } from "lucide-react";
import { nanoid } from "nanoid";
import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
import CountryCodeSelect from "./CountryCodeSelect";
import { Label } from "./ui/label";

interface AddressInput {
  id: string;
  value: string;
}

interface AddressInputListProps {
  addresses: AddressInput[];
  setAddresses: Dispatch<
    SetStateAction<
      {
        id: string;
        value: string;
      }[]
    >
  >;
  setStreetsResponses: Dispatch<
    SetStateAction<
      {
        id: string;
        response: StreetSearchResponse | null;
      }[]
    >
  >;
  countryCode: CountryCode;
  onCountryChange: (code: CountryCode) => void;
}

const MAX_ADDRESSES_TO_VALIDATE = 5;

export default function AddressInputList({
  addresses,
  setAddresses,
  setStreetsResponses,
  countryCode,
  onCountryChange,
}: AddressInputListProps) {
  const [loading, setLoading] = useState(false);

  const handleAddressChange = (id: string, value: string) => {
    setAddresses((prev) =>
      prev.map((a) => (a.id === id ? { ...a, value } : a))
    );
  };

  const handleAddAddress = () => {
    setAddresses((prev) => [...prev, { id: nanoid(), value: "" }]);
  };

  const handleRemoveAddress = (id: string) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
    setStreetsResponses((prev) => prev.filter((r) => r.id !== id));
  };

  const validateAddresses = async () => {
    setLoading(true);
    try {
      const responses = await Promise.all(
        addresses.map(async (address) => {
          const response = await getStreets(address.value, countryCode);
          return { id: address.id, response };
        })
      );
      setStreetsResponses(responses);
    } catch (e) {
      console.error("Validation error:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <CountryCodeSelect value={countryCode} onChange={onCountryChange} />

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <Label>Addresses to validate</Label>
          <div className="flex items-center justify-center gap-2">
            <div className="text-sm bg-secondary border py-0.5 px-2.5 rounded-sm font-medium">
              {addresses.length}/{MAX_ADDRESSES_TO_VALIDATE}
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={handleAddAddress}
              disabled={addresses.length === MAX_ADDRESSES_TO_VALIDATE}
            >
              <Plus />
            </Button>
          </div>
        </div>

        {addresses.map((address) => (
          <div key={address.id} className="flex gap-2 items-center">
            <Input
              value={address.value}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                handleAddressChange(address.id, e.target.value)
              }
              placeholder="Enter address"
            />
            {addresses.length !== 1 && (
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleRemoveAddress(address.id)}
                disabled={addresses.length === 1}
              >
                <Minus />
              </Button>
            )}
          </div>
        ))}
        <Button
          onClick={validateAddresses}
          disabled={loading}
          size="lg"
          className="mt-6"
        >
          {loading ? "Validating..." : "Validate"}
        </Button>
      </div>
    </>
  );
}
