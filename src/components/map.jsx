"use client";

import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Button } from "./ui/button";
import { Locate, MapPin } from "lucide-react";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

function LocationMarker({ position, setPosition, readOnly }) {
  const map = useMapEvents({
    click(e) {
      if (!readOnly) {
        setPosition({
          lat: e.latlng.lat,
          lng: e.latlng.lng,
        });
      }
    },
  });

  useEffect(() => {
    if (position) {
      map.flyTo([position.lat, position.lng], map.getZoom());
    }
  }, [position, map]);

  return position ? <Marker position={[position.lat, position.lng]} /> : null;
}

export default function Map({
  onLocationSelect,
  initialPosition,
  readOnly = false,
}) {
  const [position, setPosition] = useState(initialPosition || null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const mapRef = useRef(null);

  const handleUseCurrentLocation = () => {
    setIsLoadingLocation(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const newPosition = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          };
          setPosition(newPosition);
          if (onLocationSelect) {
            onLocationSelect(newPosition);
          }
          setIsLoadingLocation(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          setIsLoadingLocation(false);
        }
      );
    } else {
      setIsLoadingLocation(false);
    }
  };

  useEffect(() => {
    if (position && onLocationSelect) {
      onLocationSelect(position);
    }
  }, [position, onLocationSelect]);

  const defaultCenter = position
    ? [position.lat, position.lng]
    : [-6.2088, 106.8456];

  return (
    <div className="space-y-3">
      {!readOnly && (
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleUseCurrentLocation}
            disabled={isLoadingLocation}
            className="flex items-center gap-2"
          >
            <Locate className="h-4 w-4" />
            {isLoadingLocation ? "Getting location..." : "Use Current Location"}
          </Button>
        </div>
      )}
      <div className="h-[400px] w-full rounded-lg overflow-hidden border relative z-0">
        <MapContainer
          center={defaultCenter}
          zoom={13}
          className="h-full w-full"
          ref={mapRef}
          zoomControl={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker
            position={position}
            setPosition={setPosition}
            readOnly={readOnly}
          />
        </MapContainer>
      </div>
    </div>
  );
}
