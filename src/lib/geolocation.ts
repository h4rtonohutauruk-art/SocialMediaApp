import { Geolocation } from "@capacitor/geolocation";

export async function getCurrentLocation() {
  const permission = await Geolocation.checkPermissions();

  if (permission.location !== "granted") {
    await Geolocation.requestPermissions();
  }

  const position = await Geolocation.getCurrentPosition({
    enableHighAccuracy: true,
    timeout: 10000,
  });
  return position.coords;
}
