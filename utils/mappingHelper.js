import uttaraToDiuRoute from "@/assets/routes/uttara_diu.json";
import mirpur10ToDiuRoute from "@/assets/routes/mirpur_10_diu.json";

export function selectRoutePolyline(currentRoute) {
  if (currentRoute.endLocation == "Uttara") return uttaraToDiuRoute;
  else if (currentRoute.endLocation == "Mirpur-10") return mirpur10ToDiuRoute;
  else return { type: "FeatureCollection", features: [] };
}

export function generateMarkers(activeBuses) {
  return Object.entries(activeBuses).map(([busName, data]) => ({
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [data.longitude, data.latitude],
    },
    properties: {
      icon: "marker",
      title: `${data.trip.busName}\n${data.trip.direction}\n${data.trip.busType +" bus"}\n${parseInt(data.speed)} m/s`,
      direction: data.trip.direction,
      heading: data.heading,
      speed: data.speed,
    },
  }));
}
