'use client'

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Box, Button, Flex, HStack, Input, VStack, Text } from '@chakra-ui/react';
import L from 'leaflet';
import { GiMineTruck } from 'react-icons/gi';
import ReactDOMServer from 'react-dom/server';

// Interface de camiones
interface Truck {
  id: number;
  name: string;
  model: string;
  serie: string;
  position: { lat: number; lng: number };
  visible: boolean;
}

// Datos iniciales de camiones
const initialData: Truck[] = [
  { id: 1, name: 'Truck 1', model: 'A50000', serie: 'T1', position: { lat: -33.0458, lng: -71.6197 }, visible: true },
  { id: 2, name: 'Truck 2', model: 'A50001', serie: 'T2', position: { lat: -33.0468, lng: -71.6207 }, visible: true },
];

// Componente que sigue al camión
const FollowTruck = ({ truck }: { truck: Truck | null }) => {
  const map = useMap();
  useEffect(() => {
    if (truck) {
      map.flyTo([truck.position.lat, truck.position.lng], 15);
    }
  }, [truck, map]);
  return null;
};

const TruckMap = () => {
  const [trucks, setTrucks] = useState<Truck[]>(initialData);
  const [followedTruck, setFollowedTruck] = useState<Truck | null>(null);
  const [highlightedTruck, setHighlightedTruck] = useState<Truck | null>(null);
  const [filter, setFilter] = useState('');

  // Simular movimiento de camiones cada 5 segundos
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

  // Crear icono personalizado
  const truckIcon = (highlight: boolean) =>
    L.divIcon({
      html: ReactDOMServer.renderToString(<GiMineTruck size="30" color={highlight ? 'red' : 'orange'} />),
      className: 'custom-icon',
      iconSize: [30, 30],
    });

  // Filtrar camiones
  const filteredTrucks = trucks.filter(truck => truck.model.includes(filter));

  return (
    <Flex height="100vh">
      {/* Mapa */}
      <Box height="100%" width="70%">
        <MapContainer center={[-33.0458, -71.6197]} zoom={14} style={{ height: '100%', width: '100%' }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />
          {trucks.map(truck => (
            truck.visible && (
              <Marker
                key={truck.id}
                position={truck.position}
                icon={truckIcon(truck.id === highlightedTruck?.id)}
              >
                <Popup>{`${truck.name} - ${truck.model}`}</Popup>
              </Marker>
            )
          ))}
          <FollowTruck truck={followedTruck} />
        </MapContainer>
      </Box>

      {/* Panel lateral */}
      <Box width="30%" padding={4} bg="gray.50" overflowY="auto">
        <VStack spacing={4} align="start">
          {/* Input de filtro */}
          <Input
            placeholder="Filtrar por modelo"
            value={filter}
            onChange={e => setFilter(e.target.value)}
            mb={4}
          />
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
                {/* Botón para destacar el camión */}
                <Button size="sm" onClick={() => setHighlightedTruck(truck)}>
                  Destacar
                </Button>
                {/* Botón para hacer visible/invisible */}
                <Button
                  size="sm"
                  colorScheme={truck.visible ? 'red' : 'green'}
                  onClick={() =>
                    setTrucks(trucks.map(t => (t.id === truck.id ? { ...t, visible: !t.visible } : t)))
                  }
                >
                  {truck.visible ? 'Invisibilizar' : 'Visibilizar'}
                </Button>
                {/* Botón para seguir el camión */}
                <Button
                  size="sm"
                  colorScheme="blue"
                  onClick={() => setFollowedTruck(truck)}
                >
                  Seguir
                </Button>
              </HStack>
            </Box>
          ))}
        </VStack>
      </Box>
    </Flex>
  );
};

export default TruckMap;
