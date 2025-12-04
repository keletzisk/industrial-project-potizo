import { useEffect, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import { useToast } from "@chakra-ui/toast";

const loader = new Loader({
  apiKey: process.env.REACT_APP_GOOGLE_API_KEY,
  version: "weekly",
});

const DEFAULT_LAT = 40.6401;
const DEFAULT_LNG = 22.9444;
export const DEFAULT_ZOOM = 18;

export function useGoogleMap() {
  const [map, setMap] = useState();
  const toast = useToast();

  useEffect(() => {
    async function buildMap() {
      try {
        const { Map } = await loader.importLibrary("maps");

        if (!document.getElementById("google-map")) return;

        const googleStaticMap = new Map(document.getElementById("google-map"), {
          center: { lat: DEFAULT_LAT, lng: DEFAULT_LNG },
          zoom: DEFAULT_ZOOM,
          mapTypeId: "roadmap",
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
          // gestureHandling: "greedy",
          styles: [
            {
              featureType: "poi",
              elementType: "labels",
              stylers: [{ visibility: "off" }],
            },
            {
              featureType: "transit.station.bus",
              stylers: [{ visibility: "off" }],
            },
          ],
          restriction: {
            latLngBounds: {
              north: 40.69085,
              south: 40.550558,
              west: 22.872475,
              east: 23.039703,
            },
            strictBounds: true,
          },
        });

        setMap(googleStaticMap);
      } catch (error) {
        toast({
          title: "Πρόβλημα κατά τη φόρτωση του χάρτη",
          status: "error",
          isClosable: true,
        });
      }
    }

    buildMap();
  }, [toast]);

  return map;
}
