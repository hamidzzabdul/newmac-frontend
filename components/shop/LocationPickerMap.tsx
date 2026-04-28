"use client";

import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

type Props = {
  lat: number;
  lng: number;
  onChange: (lat: number, lng: number) => void;
};

const mapContainerStyle = {
  width: "100%",
  height: "260px",
};

export default function LocationPickerMap({ lat, lng, onChange }: Props) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  if (!isLoaded) {
    return (
      <div className="mt-3 h-65 rounded-xl bg-gray-100 flex items-center justify-center text-sm text-gray-500">
        Loading map...
      </div>
    );
  }

  return (
    <div className="mt-3 rounded-xl overflow-hidden border border-gray-200">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={{ lat, lng }}
        zoom={16}
        onClick={(e) => {
          if (!e.latLng) return;
          onChange(e.latLng.lat(), e.latLng.lng());
        }}
        options={{
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
        }}
      >
        <Marker
          position={{ lat, lng }}
          draggable
          onDragEnd={(e) => {
            if (!e.latLng) return;
            onChange(e.latLng.lat(), e.latLng.lng());
          }}
        />
      </GoogleMap>
    </div>
  );
}
