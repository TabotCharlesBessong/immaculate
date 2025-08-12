import React, { useState, useEffect, useRef } from 'react'
import { View, StyleSheet, Alert } from 'react-native'
import MapView, { Marker, UrlTile, Region } from 'react-native-maps'
import * as Location from 'expo-location'

// This component now encapsulates the native map logic
export default function MapComponent() {
  const osmTileUrl = 'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png'
  const [location, setLocation] = useState<Location.LocationObject | null>(null)
  const mapRef = useRef<MapView>(null)

  useEffect(() => {
    ;(async () => {
      let { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
        Alert.alert(
          'Permission Denied',
          'Permission to access location was denied.'
        )
        return
      }

      let currentLocation = await Location.getCurrentPositionAsync({})
      setLocation(currentLocation)

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
    <MapView
      ref={mapRef}
      style={StyleSheet.absoluteFill}
      initialRegion={{
        latitude: -1.286389,
        longitude: 36.817223,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }}
    >
      <UrlTile urlTemplate={osmTileUrl} maximumZ={19} flipY={false} />
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
  )
}
