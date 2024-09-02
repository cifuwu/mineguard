'use client';

import React from 'react';
import { Grid, Box, Text, Flex, Icon} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { FaArrowRight } from 'react-icons/fa'; 

const mockTrucksData = [
    {
        truck: '785D-3',
        serie: 'B70012',
        driver: 'Carlos Gómez',
        serviceTime: 90,
        position: { lat: -2, lon: 3 },
      },
      {
        truck: '730E-8',
        serie: 'C80023',
        driver: 'Ana Martínez',
        serviceTime: 82,
        position: { lat: 1, lon: -1 },
      },
      {
        truck: '830E-5',
        serie: 'D90034',
        driver: 'Luis Fernández',
        serviceTime: 65,
        position: { lat: 0, lon: -2 },
      },
      {
        truck: '960E-1',
        serie: 'E10045',
        driver: 'María López',
        serviceTime: 78,
        position: { lat: 2, lon: 2 },
      },
      {
        truck: '700E-8',
        serie: 'F20056',
        driver: 'Pedro Sánchez',
        serviceTime: 85,
        position: { lat: -3, lon: 4 },
      },
      {
        truck: '730E-7',
        serie: 'G30067',
        driver: 'Sofía Rivera',
        serviceTime: 88,
        position: { lat: 1, lon: 0 },
      },
      {
        truck: '830E-9',
        serie: 'H40078',
        driver: 'Juan Pérez',
        serviceTime: 72,
        position: { lat: -1, lon: 2 },
      },
      {
        truck: '960E-2',
        serie: 'I50089',
        driver: 'Lucía Morales',
        serviceTime: 80,
        position: { lat: 0, lon: 1 },
      },
      {
        truck: '785D-2',
        serie: 'J60090',
        driver: 'Diego Castro',
        serviceTime: 77,
        position: { lat: 3, lon: -3 },
      },
      {
        truck: '730E-6',
        serie: 'K70001',
        driver: 'Valeria Cruz',
        serviceTime: 68,
        position: { lat: -2, lon: -1 },
      },
  
];

const TruckMonitoringPage = () => {


  const handleArrowClick = (serie) => {
    window.location.href = `/admin/dashboards/devMonChart?serie=${encodeURIComponent(serie)}`;
  };

  return (
    <Grid
      templateColumns="repeat(auto-fill, minmax(250px, 1fr))"
      p={10}
      mt="100px"
      boxShadow="md" 
      borderRadius="xl"
      zIndex={1}
    >  
      {mockTrucksData.map((truck, index) => (
        <Box 
          key={index} 
          p={4} 
          borderWidth="1px" 
          borderRadius="xl"
          bg="#7551FF" 
          color="#FFFFFF"
          width="236px"  
          height="184px" 
          position= "relative"
          m={4}
        >
          <Text fontSize="xl" fontWeight="bold">{truck.truck}</Text>
          <Text>Serie: {truck.serie}</Text>
          <Text>Conductor: {truck.driver}</Text>
          <Text>Horas de servicio: {truck.serviceTime} hrs</Text>
          <Text>Posición: lat {truck.position.lat}, lon {truck.position.lon}</Text>
          <Flex 
            position="absolute" 
            bottom="2" 
            right="2"
            align="center"
            justify="center"
            onClick={() => handleArrowClick(truck.serie)}
            cursor="pointer"
            zIndex="docked"
          >
            <Icon as={FaArrowRight} w={4} h={4} color="#FFFFFF" />
          </Flex>
        </Box>
    ))}
    </Grid>

  );
};

export default TruckMonitoringPage;
