import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

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
  const { toast } = useToast();
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  useEffect(() => {
    const initializeMap = async () => {
      if (!mapContainer.current) return;

      try {
        console.log('Fetching Mapbox key from Edge Function');
        const { data, error } = await supabase.functions.invoke('get-mapbox-key');
        
        if (error) {
          console.error('Error fetching Mapbox key:', error);
          toast({
            title: "Error loading map",
            description: "Please try again later",
            variant: "destructive",
          });
          return;
        }

        if (!data?.key) {
          console.error('No Mapbox key returned from Edge Function');
          toast({
            title: "Error loading map",
            description: "Map configuration is missing",
            variant: "destructive",
          });
          return;
        }

        console.log('Initializing Mapbox map');
        mapboxgl.accessToken = data.key;
        
        // Only create a new map if one doesn't exist
        if (!map.current) {
          map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [15.2663, -4.4419], // Brazzaville coordinates
            zoom: 12
          });

          // Add navigation controls
          map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
        }

        // Clear existing markers
        markersRef.current.forEach(marker => marker.remove());
        markersRef.current = [];

        // Add markers for properties
        properties.forEach(property => {
          const marker = new mapboxgl.Marker()
            .setLngLat([property.longitude, property.latitude])
            .setPopup(new mapboxgl.Popup().setHTML(`<h3>${property.title}</h3>`))
            .addTo(map.current!);
          
          markersRef.current.push(marker);
        });

      } catch (error) {
        console.error('Error initializing map:', error);
        toast({
          title: "Error loading map",
          description: "An unexpected error occurred",
          variant: "destructive",
        });
      }
    };

    initializeMap();

    // Cleanup function
    return () => {
      // Remove markers first
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];
      
      // Then remove the map if it exists
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [properties, toast]);

  return (
    <div className="w-full h-[400px] rounded-lg overflow-hidden shadow-lg">
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
};

export default PropertyMap;