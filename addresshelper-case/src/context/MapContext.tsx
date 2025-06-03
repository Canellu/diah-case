"use client";

import { createContext, useContext, useState } from "react";

interface Location {
  lat: number;
  lng: number;
}

interface MapContextValue {
  location: Location | null;
  setLocation: (loc: Location) => void;
}

const MapContext = createContext<MapContextValue | undefined>(undefined);

export const MapProvider = ({ children }: { children: React.ReactNode }) => {
  const [location, setLocation] = useState<Location | null>(null);

  return (
    <MapContext.Provider value={{ location, setLocation }}>
      {children}
    </MapContext.Provider>
  );
};

export const useMapContext = () => {
  const context = useContext(MapContext);
  if (!context) {
    throw new Error("useMapContext must be used within a MapProvider");
  }
  return context;
};
