"use client";

import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Fix Leaflet default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

// Custom icons for different statuses
const getMarkerIcon = (status) => {
  const colors = {
    VERIFIED: "#22c55e", // green
    REJECTED: "#ef4444", // red
    PENDING: "#eab308", // yellow
  };

  const color = colors[status] || "#6b7280"; // gray default

  return L.divIcon({
    className: "custom-marker",
    html: `
      <div style="
        background-color: ${color};
        width: 28px;
        height: 28px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 3px solid white;
        box-shadow: 0 2px 5px rgba(0,0,0,0.3);
      ">
        <div style="
          width: 10px;
          height: 10px;
          background-color: white;
          border-radius: 50%;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        "></div>
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -28],
  });
};

const getCategoryLabel = (category) => {
  const labels = {
    PILAH_SAMPAH: "Pilah Sampah",
    TANAM_POHON: "Tanam Pohon",
    HEMAT_ENERGI: "Hemat Energi",
    DAUR_ULANG: "Daur Ulang",
  };
  return labels[category] || category;
};

const getStatusBadgeColor = (status) => {
  switch (status) {
    case "VERIFIED":
      return "bg-green-100 text-green-700 border-green-300";
    case "REJECTED":
      return "bg-red-100 text-red-700 border-red-300";
    case "PENDING":
      return "bg-yellow-100 text-yellow-700 border-yellow-300";
    default:
      return "bg-gray-100 text-gray-700 border-gray-300";
  }
};

export default function ActionsMap({
  actions = [],
  initialPosition,
  onMarkerClick,
}) {
  const mapRef = useRef(null);

  const defaultCenter =
    initialPosition && initialPosition.lat && initialPosition.lng
      ? [initialPosition.lat, initialPosition.lng]
      : [-6.2088, 106.8456]; // Jakarta default

  useEffect(() => {
    // Fit bounds to show all markers
    if (mapRef.current && actions.length > 0) {
      const bounds = L.latLngBounds(
        actions.map((action) => [action.latitude, action.longitude])
      );
      mapRef.current.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [actions]);

  if (actions.length === 0) {
    return (
      <div className="h-[400px] w-full rounded-lg border flex items-center justify-center bg-zinc-50">
        <p className="text-zinc-500">
          Tidak ada data untuk ditampilkan di peta
        </p>
      </div>
    );
  }

  return (
    <div className="h-[400px] w-full rounded-lg overflow-hidden border relative z-0">
      <MapContainer
        center={defaultCenter}
        zoom={11}
        className="h-full w-full"
        ref={mapRef}
        zoomControl={true}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {actions.map((action) => (
          <Marker
            key={action.id}
            position={[action.latitude, action.longitude]}
            icon={getMarkerIcon(action.status)}
          >
            <Popup>
              <div className="p-2 min-w-[200px]">
                <p className="font-semibold text-sm mb-1">
                  {getCategoryLabel(action.category)}
                </p>
                <p className="text-xs text-zinc-600 mb-2">
                  {action.locationName}
                </p>
                <p className="text-xs text-zinc-500 mb-2">
                  {action.district}, {action.city}
                </p>
                <Badge
                  className={`text-xs mb-2 ${getStatusBadgeColor(
                    action.status
                  )}`}
                >
                  {action.status}
                </Badge>
                {action.points > 0 && (
                  <p className="text-xs font-medium text-green-600 mb-2">
                    {action.points} poin
                  </p>
                )}
                <Button
                  size="sm"
                  className="w-full mt-2"
                  onClick={() => onMarkerClick && onMarkerClick(action)}
                >
                  Lihat Detail
                </Button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
