"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { ConflictEvent } from "@/lib/types";

function markerColor(confidence: string) {
  const level = confidence.toLowerCase();
  if (level === "verified") return "#4ade80";
  if (level === "disputed" || level === "medium") return "#facc15";
  return "#f87171";
}

function badgeLabel(confidence: string) {
  const level = confidence.toLowerCase();
  if (level === "verified") return '<span style="color:#4ade80">VERIFIED</span>';
  if (level === "disputed" || level === "medium")
    return '<span style="color:#facc15">DISPUTED</span>';
  return '<span style="color:#f87171">UNCONFIRMED</span>';
}

export default function LeafletMap({ events }: { events: ConflictEvent[] }) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    const map = L.map(mapRef.current, {
      center: [30, 40],
      zoom: 3,
      zoomControl: true,
      scrollWheelZoom: true,
      attributionControl: false,
    });

    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
      {
        maxZoom: 19,
        subdomains: "abcd",
      },
    ).addTo(map);

    mapInstance.current = map;

    return () => {
      map.remove();
      mapInstance.current = null;
    };
  }, []);

  // Update markers when events change
  useEffect(() => {
    const map = mapInstance.current;
    if (!map) return;

    // clear existing markers
    map.eachLayer((layer) => {
      if (layer instanceof L.CircleMarker) map.removeLayer(layer);
    });

    if (!events.length) return;

    const bounds = L.latLngBounds([]);

    events.forEach((event) => {
      const color = markerColor(event.confidenceLevel);
      const latlng = L.latLng(event.latitude, event.longitude);
      bounds.extend(latlng);

      const marker = L.circleMarker(latlng, {
        radius: 7,
        fillColor: color,
        fillOpacity: 0.8,
        color: color,
        weight: 2,
        opacity: 0.5,
      }).addTo(map);

      marker.bindPopup(
        `<div style="font-family:Inter,sans-serif;min-width:200px">
          <p style="font-weight:600;font-size:14px;margin:0 0 4px">${event.title}</p>
          <p style="font-size:12px;color:#94a3b8;margin:0 0 6px">${event.eventType} · ${badgeLabel(event.confidenceLevel)}</p>
          <p style="font-size:12px;color:#cbd5e1;margin:0 0 8px;line-height:1.4">${event.description}</p>
          <p style="font-size:11px;color:#64748b;margin:0 0 6px">Source: ${event.source}</p>
          <a href="/conflicts/${event.conflictId}" style="font-size:12px;color:#38bdf8;text-decoration:none">View conflict &rarr;</a>
        </div>`,
        { className: "geopulse-popup" },
      );
    });

    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 6 });
    }
  }, [events]);

  return (
    <>
      <style>{`
        .geopulse-popup .leaflet-popup-content-wrapper {
          background: #0f172a;
          border: 1px solid #334155;
          border-radius: 12px;
          color: #f8fafc;
          box-shadow: 0 10px 25px rgba(0,0,0,0.5);
        }
        .geopulse-popup .leaflet-popup-tip {
          background: #0f172a;
          border: 1px solid #334155;
        }
        .geopulse-popup .leaflet-popup-close-button {
          color: #94a3b8;
        }
      `}</style>
      <div
        ref={mapRef}
        className="h-[400px] w-full rounded-2xl overflow-hidden border border-[var(--border)]"
      />
    </>
  );
}
