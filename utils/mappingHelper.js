import uttaraToDiuRoute from "@/assets/routes/uttara_diu.json";
import mirpur10ToDiuRoute from "@/assets/routes/mirpur_10_diu.json";

export function selectRoutePolyline(currentRoute) {
  if (currentRoute.endLocation == "Uttara") return uttaraToDiuRoute;
  else if (currentRoute.endLocation == "Mirpur-10") return mirpur10ToDiuRoute;
  else return { type: "FeatureCollection", features: [] };
}

export function generateMarkers(busLocations) {
  return Object.entries(busLocations).map(([busId, data]) => ({
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [data.location.longitude, data.location.latitude],
    },
    properties: {
      icon: "marker",
      title: `${data.bus.name[0]}-${data.bus.serialNumber}`,
    },
  }));
}
