'use client'
import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Box, Image, Button, Flex, HStack, Input, VStack, Text, Spacer, useColorModeValue } from '@chakra-ui/react';
import L from 'leaflet';
import { GiMineTruck } from 'react-icons/gi';
import ReactDOMServer from 'react-dom/server';
import Card from "components/card/Card";

const SOCKET_URL = process.env.NEXT_PUBLIC_ENDPOINT_MAP;

interface Truck {
  id: number;
  name: string;
  model: string;
  serie: string;
  driver: string;
  contactNumber: string;
  imgurl: string;
  position: { lat: number; lng: number };
  visible: boolean;
}

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
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const boxColor = useColorModeValue('white', 'navy.900');
  const boxBorderColor = useColorModeValue('gray.200', 'navy.900');
  const boxBorderColorHighlighted = useColorModeValue('blue.500', 'brand.400');

  const [trucks, setTrucks] = useState<Truck[]>([]);
  const [followedTruck, setFollowedTruck] = useState<Truck | null>(null);
  const [highlightedTruck, setHighlightedTruck] = useState<Truck | null>(null);
  const [filter, setFilter] = useState('');
  let isInitialized = false; // Variable auxiliar para manejar la inicialización

  useEffect(() => {
    const socket = new WebSocket(`${SOCKET_URL}`);

    socket.onmessage = (event) => {
      const data = event.data;
      const msg = JSON.parse(data);

      if (!isInitialized) {
        console.log('ENTRÓOOOO'); // Confirmación de inicialización
        const trucksArray: Truck[] = Object.values(msg.trucks).map((truck: any, index) => ({
          id: index + 1,
          name: truck.driver,
          model: truck.model,
          serie: truck.truck_id,
          driver: truck.driver,
          contactNumber: truck.contactNumber,
          imgurl: truck.imgurl,
          position: { lat: truck.lat, lng: truck.lon },
          visible: true,
        }));

        setTrucks(trucksArray);
        isInitialized = true; // Marca como inicializado localmente
      } else {
        const updatedTrucks = Object.values(msg.trucks) as Truck[];

        setTrucks((prevTrucks) =>
          prevTrucks.map((truck) => {
            const updatedTruck = updatedTrucks.find((t) => t.serie === truck.serie);
            return updatedTruck
              ? { ...truck, position: { lat: updatedTruck.position.lat, lng: updatedTruck.position.lng } }
              : truck;
          })
        );
      }
    };

    socket.onclose = () => {
      console.log('WebSocket cerrado');
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      socket.close();
    };
  }, []);

  const truckIcon = (highlight: boolean) =>
    L.divIcon({
      html: ReactDOMServer.renderToString(<GiMineTruck size="30" color={highlight ? 'red' : 'black'} />),
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
    <Flex height="90vh" p={20}> 
      {/* Mapa */}
      <Box 
        height="100%" 
        width="70%" 
        paddingRight="10px" 
        mt={15} 
        boxShadow="lg" 
        borderRadius="15px" 
      > 
        <MapContainer 
          center={[-24.26236378384671, -69.07266779893797]} 
          zoom={14} 
          style={{ height: '100%', width: '100%', borderRadius: '15px' }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />
          {filteredTrucks.map(truck => (
            truck.visible && (
              <Marker
                key={truck.id}
                position={truck.position}
                icon={truckIcon(truck.id === highlightedTruck?.id)}
              >
                <Popup>
                  {/*Texto del popup*/ }
                  <Text as="b"> {`${truck.model} - ${truck.serie}`}</Text>
                  <Text>Conductor: {`${truck.driver}`}</Text>
                  <Text>Número de telefono: {`${truck.contactNumber}`} </Text>
                  <Image src={truck.imgurl} />

                  <Button
                    size="sm"
                    colorScheme="blue"
                    mt={2}
                    boxShadow="sm" 
                    onClick={() => {
                      window.location.href = `/devMonChart?serie=${truck.serie}`;    
                    }}
                  >
                    Monitorear
                  </Button>
                  <Button
                    size="sm"
                    colorScheme="red"
                    mt={2}
                    ml={2}
                    boxShadow="sm" 
                    onClick={() => {
                      window.location.href = `/manualAlerts?serie=${truck.serie}`;
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
      <Card width="30%" padding={4} overflowY="auto" display="flex" flexDirection="column" mt={15} boxShadow="xl" borderRadius="lg">
        <VStack spacing={4} align="start" flex="1" overflowY="auto">
          {/* Lista de camiones */}
          {filteredTrucks.map(truck => (
            <Box
              key={truck.id}
              width="100%"
              padding={2}
              borderWidth="1px"
              borderRadius="lg"
              borderColor={truck.id === highlightedTruck?.id ? boxBorderColorHighlighted : boxBorderColor}
              bg={boxColor}
              boxShadow="md" 
            >
              <Text color={textColor} fontWeight="bold">{`${truck.model} - ${truck.serie}`}</Text>
              <HStack spacing={2} mt={2}>
                <Button size="sm" colorScheme="teal" boxShadow="sm" onClick={() => highlightedTruck?.id === truck.id ? setHighlightedTruck(null) : setHighlightedTruck(truck)}>
                  {highlightedTruck?.id === truck.id ? 'No Destacar' : 'Destacar'}
                </Button>
                <Button
                  size="sm"
                  colorScheme={truck.visible ? 'red' : 'green'}
                  boxShadow="sm"
                  onClick={() =>
                    setTrucks(trucks.map(t => (t.id === truck.id ? { ...t, visible: !t.visible } : t)))
                  }
                >
                  {truck.visible ? 'Invisibilizar' : 'Visibilizar'}
                </Button>
                <Button
                  size="sm"
                  colorScheme="blue"
                  boxShadow="sm"
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
            color={textColor}
            placeholder="Filtrar por modelo"
            value={filter}
            onChange={e => setFilter(e.target.value)}
            borderRadius="lg"
            boxShadow="sm"
          />
        </Box>
      </Card>
    </Flex>
  );
};

export default TruckMap;
