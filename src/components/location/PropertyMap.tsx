import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { supabase } from '@/integrations/supabase/client';

interface PropertyMapProps {
  properties?: Array<{
    id: string;
    title: string;
    latitude: number;
    longitude: number;
  }>;
}

const PropertyMap = ({ properties = [] }: PropertyMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    const initializeMap = async () => {
      if (!mapContainer.current) return;

      try {
        const { data: { key }, error } = await supabase.functions.invoke('get-mapbox-key');
        if (error) throw error;

        mapboxgl.accessToken = key;
        
        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/streets-v11',
          center: [15.2663, -4.4419], // Brazzaville coordinates
          zoom: 12
        });

        // Add navigation controls
        map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

        // Add markers for properties
        properties.forEach(property => {
          new mapboxgl.Marker()
            .setLngLat([property.longitude, property.latitude])
            .setPopup(new mapboxgl.Popup().setHTML(`<h3>${property.title}</h3>`))
            .addTo(map.current!);
        });

      } catch (error) {
        console.error('Error initializing map:', error);
      }
    };

    initializeMap();

    return () => {
      map.current?.remove();
    };
  }, [properties]);

  return (
    <div className="w-full h-[400px] rounded-lg overflow-hidden shadow-lg">
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
};

export default PropertyMap;