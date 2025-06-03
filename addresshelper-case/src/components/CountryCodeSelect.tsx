"use client";

import { getCountryNameWithCode } from "@/lib/getCountryNameWithCode";
import { CountryCode } from "@/types/countryCode";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

type CountryCodeSelectorProps = {
  value: CountryCode;
  onChange: (value: CountryCode) => void;
};

const CountryCodeSelect = ({ value, onChange }: CountryCodeSelectorProps) => {
  return (
    <div className="gap-3 flex flex-col">
      <Label htmlFor="country-code-selector">
        Country to validate addresses for
      </Label>
      <Select
        value={value}
        onValueChange={(val) => onChange(val as CountryCode)}
      >
        <SelectTrigger className="w-48">
          <SelectValue>{getCountryNameWithCode(value)}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {Object.entries(CountryCode).map(([name, code]) => (
            <SelectItem key={code} value={code}>
              {name} - ({code})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CountryCodeSelect;
