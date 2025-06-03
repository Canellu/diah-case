"use client";

import { useMapContext } from "@/context/MapContext";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useRef } from "react";

const Map = () => {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);
  const { location } = useMapContext();

  // Initialize map once
  useEffect(() => {
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

    if (mapContainerRef.current) {
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        center: [10.741, 59.91],
        zoom: 10,
      });
    }
  }, []);

  // Update map and marker on location change
  useEffect(() => {
    if (!mapRef.current || !location) return;

    // Move camera to new location
    mapRef.current.jumpTo({
      center: [location.lng, location.lat],
      zoom: 17,
    });

    // Remove previous marker
    if (markerRef.current) {
      markerRef.current.remove();
    }

    // Add new marker
    markerRef.current = new mapboxgl.Marker()
      .setLngLat([location.lng, location.lat])
      .addTo(mapRef.current);
  }, [location]);

  return <div className="w-full h-full map-container" ref={mapContainerRef} />;
};

export default Map;
