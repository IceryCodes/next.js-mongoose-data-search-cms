import { useEffect, useState } from 'react';

import { GoogleMap, InfoWindow, LoadScript, Marker } from '@react-google-maps/api';
import Image from 'next/image';
import Link from 'next/link';

import { HospitalProps } from '../hospitals/interfaces';

import { getPageUrlByType, PageType } from './interface';

interface GoogleMapComponentProps {
  hospitals: HospitalProps[];
}

const containerStyle = {
  width: '100%',
  height: '400px',
};

interface Location {
  lat: number;
  lng: number;
  id: string;
  title: string;
  description: string;
  image: string;
}

const GoogleMapComponent = ({ hospitals }: GoogleMapComponentProps) => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

  useEffect(() => {
    const geocodeAddresses = async () => {
      let apiLoaded = false;

      const timeout = setTimeout(() => {
        if (!apiLoaded) console.error('Google Maps API failed to load within timeout.');
      }, 5000); // 5 seconds timeout

      // Wait for Google Maps API to load
      const waitForApi = setInterval(() => {
        if (typeof window !== 'undefined' && window.google) {
          apiLoaded = true;
          clearTimeout(timeout);
          clearInterval(waitForApi);
          loadGeocoding();
        }
      }, 100); // Check every 100 milliseconds

      const loadGeocoding = async () => {
        try {
          const geocoder = new google.maps.Geocoder();
          const results = await Promise.all(
            hospitals.map(async ({ id, title, address, featuredImg }: HospitalProps) => {
              try {
                const response = await geocoder.geocode({ address });
                const location = response.results[0]?.geometry.location;

                if (location) {
                  return {
                    lat: location.lat(),
                    lng: location.lng(),
                    id,
                    title,
                    description: address,
                    image: featuredImg ? featuredImg : process.env.NEXT_PUBLIC_FEATURED_IMAGE,
                  };
                }
                return null;
              } catch (geocodeError) {
                console.error(`Geocoding failed for address: ${address}`, geocodeError);
                return null;
              }
            })
          );

          const validLocations = results.filter((location): location is Location => location !== null);
          setLocations(validLocations);
        } catch (generalError) {
          console.error('Error during geocoding process', generalError);
        }
      };
    };

    geocodeAddresses();
  }, [hospitals]);

  return (
    <div className="w-full h-[400px]">
      <LoadScript googleMapsApiKey={process.env.NEXT_PRIVATE_GOOGLE_API_URL as string}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={locations[0] || { lat: 25.0606989, lng: 121.4860045 }}
          zoom={12.5}
        >
          {locations.map((location, index) => (
            <Marker key={index} position={location} onClick={() => setSelectedLocation(location)} />
          ))}

          {selectedLocation && (
            <InfoWindow
              position={{ lat: selectedLocation.lat, lng: selectedLocation.lng }}
              onCloseClick={() => setSelectedLocation(null)}
            >
              <Link href={`/${getPageUrlByType(PageType.HOSPITALS)}/${selectedLocation.id}`} className="flex flex-col gap-1">
                <Image
                  src={selectedLocation.image}
                  alt={selectedLocation.title}
                  width={216}
                  height={144}
                  className="rounded"
                  priority={true}
                />
                <span>{selectedLocation.title}</span>
                <span>{selectedLocation.description}</span>
              </Link>
            </InfoWindow>
          )}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default GoogleMapComponent;
