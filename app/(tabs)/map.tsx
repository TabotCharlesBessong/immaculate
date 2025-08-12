import React,{useState,useEffect,useRef} from 'react'
import { View, StyleSheet, Text, Alert } from 'react-native'
import MapView, { Marker, UrlTile } from 'react-native-maps'
import { FONTS } from '@/constants/theme'
import * as Location from 'expo-location'
import {Region} from "react-native-maps";

export default function MapScreen() {
  // The URL template for OpenStreetMap tiles.
  const osmTileUrl = 'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png'
  const [location, setLocation] = useState<Location.LocationObject | null>(null)
  const mapRef = useRef<MapView>(null)

  useEffect(() => {
    ;(async () => {
      let { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
        Alert.alert(
          'Permission Denied',
          'Permission to access location was denied. Please enable it in your device settings.'
        )
        return
      }

      let currentLocation = await Location.getCurrentPositionAsync({})
      setLocation(currentLocation)

      // Animate map to user's location
      if (currentLocation && mapRef.current) {
        const region: Region = {
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }
        mapRef.current.animateToRegion(region, 1000)
      }
    })()
  }, [])

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: -1.286389, // Default to Nairobi, Kenya
          longitude: 36.817223,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        <UrlTile
          urlTemplate={osmTileUrl}
          maximumZ={19} // OSM max zoom level
          flipY={false} // Required for OSM
        />
        {location && (
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            title="You are here"
            pinColor="blue"
          />
        )}
      </MapView>
      <View style={styles.overlayHeader}>
        <Text style={styles.headerText}>Tafuta GPS</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  overlayHeader: {
    position: 'absolute',
    top: 50, // Adjust as needed for status bar height
    left: 20,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 4, // for Android shadow
    shadowOpacity: 0.2, // for iOS shadow
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  headerText: {
    ...FONTS.h2,
  },
})
