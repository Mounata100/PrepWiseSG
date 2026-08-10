import * as Location from "expo-location";

class LocationService {
  watchSubscription = null;

  async requestPermission() {
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      throw new Error("Location permission denied");
    }

    return true;
  }

  async getCurrentLocation() {
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Highest,
    });

    return location.coords;
  }

  async startWatching(callback) {
    this.watchSubscription = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.Highest,
        distanceInterval: 5,
        timeInterval: 3000,
      },
      (location) => {
        callback(location.coords);
      }
    );
  }

  stopWatching() {
    if (this.watchSubscription) {
      this.watchSubscription.remove();
    }
  }
}

export default new LocationService();