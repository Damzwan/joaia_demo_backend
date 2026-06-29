import {decode} from "@googlemaps/polyline-codec";
import {GOOGLE_PLACES_KEY} from "../config/env";
import {LatLng, TravelMode} from "../types/routes.types";

const ROUTES_URL = "https://routes.googleapis.com/directions/v2:computeRoutes";

/** *
 * TODO: Move Google API logic to a dedicated 'ExternalProvider' class to
 */
export const routesService = {
    async getRoute(stops: LatLng[], mode: TravelMode = "WALK"): Promise<LatLng[]> {
        if (stops.length < 2) return [];
        if (!GOOGLE_PLACES_KEY) return stops;

        try {
            const encoded = await fetchGoogleRoute(stops, mode);

            if (!encoded) return stops;
            const points = decode(encoded, 5);

            return points.map(([lat, lng]) => ({
                latitude: lat,
                longitude: lng
            }));
        } catch (err) {
            console.warn("[routesService] route fetch failed, falling back to stops:", (err as Error).message);
            return stops;
        }
    },
};

async function fetchGoogleRoute(stops: LatLng[], mode: TravelMode): Promise<string | undefined> {
    const [origin, ...rest] = stops;
    const destination = rest.pop()!;

    const res = await fetch(ROUTES_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-Goog-Api-Key": GOOGLE_PLACES_KEY!,
            "X-Goog-FieldMask": "routes.polyline.encodedPolyline",
        },
        body: JSON.stringify({
            origin: toWaypoint(origin),
            destination: toWaypoint(destination),
            intermediates: rest.map(toWaypoint),
            travelMode: mode,
            polylineEncoding: "ENCODED_POLYLINE",
        }),
    });

    if (!res.ok) throw new Error(`Google API responded with ${res.status}`);

    const data = await res.json() as { routes?: { polyline?: { encodedPolyline?: string } }[] };
    return data.routes?.[0]?.polyline?.encodedPolyline;
}

function toWaypoint(p: LatLng) {
    return {location: {latLng: {latitude: p.latitude, longitude: p.longitude}}};
}