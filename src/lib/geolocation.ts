import { Capacitor } from "@capacitor/core";
import { Geolocation } from "@capacitor/geolocation";

export async function getCurrentLocation() {
  console.log("call the getCurrentLocation:", Capacitor.getPlatform());
  try {
    if (Capacitor.isNativePlatform()) {
      console.log("masuk if berarti ini masuk ke native");
      const permission = await Geolocation.requestPermissions();

      console.log(permission);

      if (permission.location !== "granted") {
        throw new Error("Location permission denied");
      }

      const position = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000,
      });

      console.log("Position:", position);
      console.log("Coords:", position.coords);
      console.log("Latitude:", position.coords.latitude);
      console.log("Longitude:", position.coords.longitude);

      return position.coords;
    }

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
  } catch (error) {
    console.log("Error in getCurrentLocation", error);
  }
}
