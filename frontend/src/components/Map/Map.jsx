import React, { useState, useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl'; // Import MapLibre GL JS
import 'maplibre-gl/dist/maplibre-gl.css'; // Import MapLibre GL CSS
import axios from 'axios';

const MapComponent = ({listings, flyToCoordinates, city}) => {
  const mapContainerRef = useRef(null); // Reference for the map container
  const mapInstanceRef = useRef(null);  // Reference to store the map instance
  const locationIqAccessToken = 'pk.dadad7861429156330de883f13d575ee';
  const [coordinates, setCoordinates] = useState({ latitude: 14.74, longitude: 49.3 });
  
  useEffect(() => {
    const fetchLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            console.log({ latitude, longitude });
            setCoordinates({ latitude, longitude });
          },
          (error) => {
            console.error('Error fetching location:', error);
          }
        );
      } else {
        console.error('Geolocation is not supported by this browser.');
      }
    };

    const fetchCoordinates = async (address) => {
      try {
        const response = await axios.get(
          `https://us1.locationiq.com/v1/search?key=${locationIqAccessToken}&q=${address}&format=json`
        );

        const { lat, lon } = response.data[0];
        console.log({city, lat, lon})
        setCoordinates({latitude: lat, longitude: lon});
      } catch (error) {
        console.log('Error fetching coordinates:', error);
      }
    };
  
    city ? fetchCoordinates(city) : fetchLocation();
  }, [city]);  


  // map display
  useEffect(() => {
    console.log('Coordinates updated:', coordinates); 
    if (!isNaN(coordinates.latitude) && !isNaN(coordinates.longitude)) {
      // Initialize MapLibre GL JS map
      const map = new maplibregl.Map({
        container: mapContainerRef.current, // Reference to the map container
        style: `https://tiles.locationiq.com/v3/streets/vector.json?key=${locationIqAccessToken}`,
        center: [coordinates.longitude, coordinates.latitude], // Initial center [longitude, latitude]
        zoom: 14, // Initial zoom level
      });
  
      // Store the map instance for future reference
      mapInstanceRef.current = map;
  
      // Add navigation controls (zoom and rotation controls)
      map.addControl(new maplibregl.NavigationControl(), 'top-right');
  
      // Add full screen control
      map.addControl(new maplibregl.FullscreenControl());
  
      // Add geolocate control to the map
      map.addControl(new maplibregl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        trackUserLocation: true,
      }));
  
      // Add scale control
      map.addControl(new maplibregl.ScaleControl({
        maxWidth: 80,
        unit: 'metric', // Use 'imperial' for miles
      }));

      // Listen for the styleimagemissing event to handle missing images
      map.on('styleimagemissing', (e) => {
        const id = e.id;  // Get the missing image id

        if (id === 'geolocate-marker') {
          map.loadImage('https://path-to-your-image/geolocate-marker.png', (error, image) => {
            if (error) throw error;
            map.addImage(id, image);
          });
        }

        if (id === 'geolocate-heading') {
          map.loadImage('https://path-to-your-image/geolocate-heading.png', (error, image) => {
            if (error) throw error;
            map.addImage(id, image);
          });
        }
      });

      // place mark on map
      const placeMarkersOnMap = async () => {
        if (map && listings) {
          listings.forEach(async (listing) => {
            const coordinates = listing.metadata.coordinates;
    
            if (coordinates) {
              // Create a marker at the listing's location
              new maplibregl.Marker()
                .setLngLat([coordinates[0], coordinates[1]]) // [longitude, latitude]
                .setPopup(
                  new maplibregl.Popup({ offset: 25 }).setHTML(
                    `<h3>${listing.title}</h3><p>${"$"} ${listing.pricePerHour} ${"/h"}</p>`
                  )
                ) // Add a popup
                .addTo(map); // Add marker to the map
            }
          });
        }
      };
    
      placeMarkersOnMap();

      // fly to location
      map.flyTo({
        center: flyToCoordinates, // [longitude, latitude]
        zoom: 14, // Zoom level for the flyTo animation
        speed: 1, // Animation speed
        essential: true, // This ensures the animation will not be interrupted by user interaction
      });
  
      // Cleanup on unmount
      return () => map.remove();

    }
  }, [coordinates, listings, flyToCoordinates]);

  // map resize
  useEffect(() => {
    const handleResize = () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.resize();
      }
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />
  );
};

export default MapComponent;