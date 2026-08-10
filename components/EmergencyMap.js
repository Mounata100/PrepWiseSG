import React from "react";
import MapView, { Marker } from "react-native-maps";

const EmergencyMap = ({
  userLocation,
  resources,
  onMarkerPress,
}) => {

  if (!userLocation) return null;

  return (
    <MapView
      style={{ height: 450, borderRadius: 25 }}
      showsUserLocation
      followsUserLocation
      loadingEnabled
      initialRegion={{
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      }}
    >

      {resources.map(resource => (

        <Marker
          key={resource.id}
          coordinate={{
            latitude: resource.latitude,
            longitude: resource.longitude,
          }}
          title={resource.name}
          description={resource.type}
          onPress={() => onMarkerPress(resource)}
        />

      ))}

    </MapView>
  );
};

export default EmergencyMap;

/**
 * Absolutely. Since this is going to be a fairly large feature, we'll build it properly from the ground up rather than trying to cram everything into `ResourcesScreen.js`.

## Part 1 - Install the dependencies

```bash
npx expo install react-native-maps
```

```bash
npx expo install expo-location
```

---

# Step 2 - Create `services/LocationService.js`

```javascript
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
```

---

# Step 3 - Create `utility/distance.js`

```javascript
export function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;

  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) *
      Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}
```

---

# Step 4 - Create `components/EmergencyMap.js`

```javascript
import React from "react";
import MapView, { Marker } from "react-native-maps";

const EmergencyMap = ({
  userLocation,
  resources,
  onMarkerPress,
}) => {

  if (!userLocation) return null;

  return (
    <MapView
      style={{ height: 450, borderRadius: 25 }}
      showsUserLocation
      followsUserLocation
      loadingEnabled
      initialRegion={{
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      }}
    >

      {resources.map(resource => (

        <Marker
          key={resource.id}
          coordinate={{
            latitude: resource.latitude,
            longitude: resource.longitude,
          }}
          title={resource.name}
          description={resource.type}
          onPress={() => onMarkerPress(resource)}
        />

      ))}

    </MapView>
  );
};

export default EmergencyMap;
```

---

# Step 5 - Temporary resource data

Create

`data/emergencyResources.js`

```javascript
export default [

{
    id:1,
    name:"Jurong East Community Club",
    type:"Cooling Centre",
    latitude:1.3332,
    longitude:103.7428,
},

{
    id:2,
    name:"Ng Teng Fong Hospital",
    type:"Hospital",
    latitude:1.3349,
    longitude:103.7436,
},

{
    id:3,
    name:"Jurong Fire Station",
    type:"SCDF",
    latitude:1.3401,
    longitude:103.7464,
},

];
```

Later, we'll replace this with live OneMap and official datasets.

---

# Step 6 - Update `ResourcesScreen.js`

At the top, add:

```javascript
import React, { useEffect, useState } from "react";

import EmergencyMap from "../components/EmergencyMap";

import LocationService from "../services/LocationService";

import resourcesData from "../data/emergencyResources";
```

Add state:

```javascript
const [location, setLocation] = useState(null);

const [selectedResource, setSelectedResource] = useState(null);

const [resources] = useState(resourcesData);
```

Inside `useEffect`:

```javascript
useEffect(() => {

    async function loadLocation(){

        try{

            await LocationService.requestPermission();

            const coords = await LocationService.getCurrentLocation();

            setLocation(coords);

            await LocationService.startWatching(setLocation);

        }

        catch(error){

            console.log(error);

        }

    }

    loadLocation();

    return ()=>{

        LocationService.stopWatching();

    }

},[]);
```

---

# Display the map

Inside your `ScrollView`, below the status banner or in a new "Map" section:

```jsx
<Title style={styles.resourceTitle}>
    Emergency Resources Map
</Title>

<EmergencyMap
    userLocation={location}
    resources={resources}
    onMarkerPress={setSelectedResource}
/>
```

---

## What you'll have after Part 1

At this stage, your app will:

* ✅ Ask for location permission (if not already granted).
* ✅ Show the user's live location on a map.
* ✅ Update the location every few seconds as the user moves.
* ✅ Display markers for a few sample emergency resources.
* ✅ Notify your screen when a marker is tapped (ready for a details panel).

### Next step (Part 2)

We'll replace the hardcoded resource list with **real Singapore data** by integrating **OneMap**, adding:

* Search for nearby hospitals, community clubs, and other facilities.
* Automatic nearest-resource calculation.
* A bottom sheet with resource details.
* "Directions" to open navigation.
* Disaster filters (Flood, Heatwave, Haze) that change which resources are shown.

 */