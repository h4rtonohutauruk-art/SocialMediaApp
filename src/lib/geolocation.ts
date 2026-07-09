import { Capacitor } from "@capacitor/core";
import { Geolocation } from "@capacitor/geolocation";

export async function getCurrentLocation() {
  console.log("call the getCurrentLocation:", Capacitor.getPlatform());
  if (Capacitor.isNativePlatform()) {
    console.log("masuk if berarti ini masuk ke native");
    await Geolocation.requestPermissions();
    return await Geolocation.getCurrentPosition();
  }

  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
  //   const permission = await Geolocation.checkPermissions();

  //   console.log(permission);

  //   if (permission.location !== "granted") {
  //     await Geolocation.requestPermissions();
  //   }

  //   const position = await Geolocation.getCurrentPosition({
  //     enableHighAccuracy: true,
  //     timeout: 10000,
  //   });

  //   return position.coords;
}
