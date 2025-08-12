import React, { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet'
import * as Location from 'expo-location'
import { LatLngExpression } from 'leaflet'

// This is crucial for Leaflet's styles to work!
import 'leaflet/dist/leaflet.css'

// A helper component to programmatically change the map's view
function ChangeView({ center }: { center: LatLngExpression }) {
  const map = useMap()
  useEffect(() => {
    map.setView(center)
  }, [center])
  return null
}

export default function MapComponent() {
  const osmTileUrl = 'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png'
  const osmAttribution =
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'

  // Default center
  const [center, setCenter] = useState<LatLngExpression>([-1.286389, 36.817223])

  useEffect(() => {
    ;(async () => {
      let { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
        // On web, alerts can be intrusive. A console log is often better.
        console.warn('Permission to access location was denied.')
        return
      }

      let currentLocation = await Location.getCurrentPositionAsync({})
      if (currentLocation) {
        setCenter([
          currentLocation.coords.latitude,
          currentLocation.coords.longitude,
        ])
      }
    })()
  }, [])

  return (
    <MapContainer
      center={center}
      zoom={13}
      style={{ height: '100%', width: '100%' }}
    >
      <ChangeView center={center} />
      <TileLayer url={osmTileUrl} attribution={osmAttribution} />
      <Marker position={center} />
    </MapContainer>
  )
}
