'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Box, Button, Flex, HStack, Input, VStack, Text, Spacer } from '@chakra-ui/react';
import L from 'leaflet';
import { GiMineTruck } from 'react-icons/gi';
import ReactDOMServer from 'react-dom/server';

interface Truck {
  id: number;
  name: string;
  model: string;
  serie: string;
  position: { lat: number; lng: number };
  visible: boolean;
}

const initialData: Truck[] = [
  { id: 1, name: 'Truck 1', model: 'T1', serie: 'A50000', position: { lat: -33.0458, lng: -71.6197 }, visible: true },
  { id: 2, name: 'Truck 2', model: 'T2', serie: 'A50001', position: { lat: -33.0468, lng: -71.6207 }, visible: true },
];

const FollowTruck = ({ truck }: { truck: Truck | null }) => {
  const map = useMap();
  useEffect(() => {
    if (truck) {
      map.flyTo([truck.position.lat, truck.position.lng], map.getZoom());
    }
  }, [truck, map]);
  return null;
};

const TruckMap = () => {
  const [trucks, setTrucks] = useState<Truck[]>(initialData);
  const [followedTruck, setFollowedTruck] = useState<Truck | null>(null);
  const [highlightedTruck, setHighlightedTruck] = useState<Truck | null>(null);
  const [filter, setFilter] = useState('');



  useEffect(() => {
    const interval = setInterval(() => {
      setTrucks(prevTrucks =>
        prevTrucks.map(truck => ({
          ...truck,
          position: {
            lat: truck.position.lat + (Math.random() - 0.5) * 0.001,
            lng: truck.position.lng + (Math.random() - 0.5) * 0.001,
          },
        }))
      );
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const truckIcon = (highlight: boolean) =>
    L.divIcon({
      html: ReactDOMServer.renderToString(<GiMineTruck size="30" color={highlight ? 'red' : 'orange'} />),
      className: 'custom-icon',
      iconSize: [30, 30],
    });

  const filteredTrucks = trucks.filter(truck => truck.model.includes(filter));

  useEffect(() => {
    if (followedTruck) {
      const updatedTruck = trucks.find(truck => truck.id === followedTruck.id);
      if (updatedTruck) {
        setFollowedTruck(updatedTruck);
      }
    }
  }, [trucks, followedTruck]);

  return (

    <Flex height="100vh" p={20}> 
      {/* Mapa */}
      <Box height="100%" width="70%" paddingRight="10px" mt={15}> 
        <MapContainer center={[-33.0458, -71.6197]} zoom={14} style={{ height: '100%', width: '100%' }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />
          {filteredTrucks.map(truck => (
            truck.visible && (
              <Marker
                key={truck.id}
                position={truck.position}
                icon={truckIcon(truck.id === highlightedTruck?.id)}
              >
                <Popup>
                  <Text>{`${truck.name} - ${truck.serie}`}</Text>
                  <Button
                    size="sm"
                    colorScheme="blue"
                    mt={2}
                    onClick={() => {
                      window.location.href =  `/devMonChart?serie=${truck.serie}`;    
                    }}
                  >
                    Monitorear
                  </Button>
                  <Button
                    size="sm"
                    colorScheme="red"
                    mt={2}
                    ml={2}
                    onClick={() => {
                      window.location.href =  `/manualAlerts?serie=${truck.serie}`;
                    }}
                  >
                    Alertar
                  </Button>
                </Popup>
              </Marker>
            )
          ))}
          <FollowTruck truck={followedTruck} />
        </MapContainer>
      </Box>

      {/* Panel lateral */}
      <Box width="30%" padding={4} bg="gray.50" overflowY="auto" display="flex" flexDirection="column" mt={15}>
        <VStack spacing={4} align="start" flex="1" overflowY="auto">
          {/* Lista de camiones */}
          {filteredTrucks.map(truck => (
            <Box
              key={truck.id}
              width="100%"
              padding={2}
              borderWidth="1px"
              borderRadius="md"
              borderColor={truck.id === highlightedTruck?.id ? 'blue.500' : 'gray.200'}
              bg={truck.visible ? 'white' : 'gray.200'}
            >
              <Text fontWeight="bold">{`${truck.model} - ${truck.serie}`}</Text>
              <HStack spacing={2} mt={2}>
                <Button size="sm" onClick={() => setHighlightedTruck(truck)}>
                  Destacar
                </Button>
                <Button
                  size="sm"
                  colorScheme={truck.visible ? 'red' : 'green'}
                  onClick={() =>
                    setTrucks(trucks.map(t => (t.id === truck.id ? { ...t, visible: !t.visible } : t)))
                  }
                >
                  {truck.visible ? 'Invisibilizar' : 'Visibilizar'}
                </Button>
                <Button
                  size="sm"
                  colorScheme="blue"
                  onClick={() => followedTruck?.id === truck.id ? setFollowedTruck(null) : setFollowedTruck(truck)}
                >
                  {followedTruck?.id === truck.id ? 'Dejar de Seguir' : 'Seguir'}
                </Button>
              </HStack>
            </Box>
          ))}
        </VStack>
        
        {/* Input de filtro en la parte baja */}
        <Box mt={4} width="100%">
          <Input
            placeholder="Filtrar por modelo"
            value={filter}
            onChange={e => setFilter(e.target.value)}
          />
        </Box>
      </Box>
    </Flex>
  );
};

export default TruckMap;
