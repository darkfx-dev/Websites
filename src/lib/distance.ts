/**
 * Straight-line distance between two points on the earth.
 *
 * Deliberately dependency-free so it can be unit-tested directly.
 *
 * IMPORTANT: this is great-circle ("as the crow flies") distance. It is NOT
 * road distance and NOT travel time, and the UI must never present it as
 * either — see `formatApproxKm`, which labels its output as approximate.
 */

const EARTH_RADIUS_KM = 6371;

export type LatLng = {
  latitude: number;
  longitude: number;
};

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

function isValidPoint(point: LatLng | null | undefined): point is LatLng {
  if (!point) return false;
  const { latitude, longitude } = point;
  return (
    Number.isFinite(latitude) &&
    Number.isFinite(longitude) &&
    latitude >= -90 &&
    latitude <= 90 &&
    longitude >= -180 &&
    longitude <= 180
  );
}

/**
 * Haversine distance in kilometres, or `null` when either point is missing or
 * not a finite, in-range coordinate. Returning `null` rather than NaN keeps
 * "no distance" a single explicit case for callers to handle.
 */
export function haversineKm(
  from: LatLng | null | undefined,
  to: LatLng | null | undefined
): number | null {
  if (!isValidPoint(from) || !isValidPoint(to)) return null;

  const dLat = toRadians(to.latitude - from.latitude);
  const dLon = toRadians(to.longitude - from.longitude);
  const lat1 = toRadians(from.latitude);
  const lat2 = toRadians(to.latitude);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.asin(Math.min(1, Math.sqrt(a)));

  return EARTH_RADIUS_KM * c;
}

/**
 * Presentation only. Distances are compared and sorted as raw numbers; this
 * runs at render time and never feeds back into the maths.
 */
export function formatApproxKm(km: number | null): string | null {
  if (km === null || !Number.isFinite(km)) return null;
  if (km < 1) return `Approx. ${Math.round(km * 1000)} m away`;
  return `Approx. ${km.toFixed(1)} km away`;
}
