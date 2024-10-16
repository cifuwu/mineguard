"use client";

import React, { useState, useEffect } from 'react';
import { Grid, Box, Text, Flex, Icon } from '@chakra-ui/react';
import { FaArrowRight } from 'react-icons/fa';
import Link from 'next/link';


//  wss://ab7d-190-44-116-48.ngrok-free.app/ws
const SOCKET_URL = process.env.NEXT_PUBLIC_WEBSOCKET_ENDPOINT;



const TruckMonitoringPage = () => {
  const [trucksData, setTrucksData] = useState([]);

  useEffect(() => {
    const websockets = [];
    
    for (let i = 50000; i <= 50020; i++) {
      const serie = `A${i}`;
      const socket = new WebSocket(`${SOCKET_URL}?serie=${serie}`);

      websockets.push(socket);

      socket.onmessage = (event) => {
          const data = event.data;
          const msg = JSON.parse(data);

          //console.log(msg);

          const truckData = {
            truck: msg.truck,
            serie: msg.serie,
            conductor: msg.conductor,
            serviceTime: msg.serviceTime,
            position: {
              lat: msg.position.lat,
              lon: msg.position.lon
            }
          };


          setTrucksData((prevData) => {
            const existingIndex = prevData.findIndex(truck => truck.serie === truckData.serie);
    
            if (existingIndex !== -1) {
              // Si ya existe, actualiza el objeto existente
              const updatedData = [...prevData];
              updatedData[existingIndex] = truckData;
              return updatedData;
            } else {
              // Si no existe, lo agrega
              return [...prevData, truckData];
            }
          });
          
      };


      socket.onclose = () => {
        console.log('WebSocket cerrado');
    };

    socket.onerror = (error) => {
        console.error('WebSocket error:', error);
    };


    }

    return () => {
      websockets.forEach((socket) => socket.close());
    };
  }, []);


  const handleArrowClick = (serie) => {
    window.location.href = `/devMonChart?serie=${encodeURIComponent(serie)}`;
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
      {trucksData.map((truck, index) => (
        <Box
          key={index}
          p={4}
          borderWidth="1px"
          borderRadius="xl"
          bg="#7551FF"
          color="#FFFFFF"
          width="236px"
          height="184px"
          position="relative"
          m={4}
        >
          <Text fontSize="xl" fontWeight="bold">{truck.truck}</Text>
          <Text>Serie: {truck.serie}</Text>
          <Text>Conductor: {truck.conductor}</Text>
          <Text>Horas de servicio: {truck.serviceTime} hrs</Text>
          <Text>Posición: lat {truck.position.lat}, lon {truck.position.lon}</Text>
          <Link
            href={`/devMonChart?serie=${encodeURIComponent(truck.serie)}`}
            >
            <Flex
              position="absolute"
              bottom="2"
              right="2"
              align="center"
              justify="center"
              // onClick={() => handleArrowClick(truck.serie)}
              cursor="pointer"
              zIndex="docked"
            >
              <Icon as={FaArrowRight} w={4} h={4} color="#FFFFFF" />
            </Flex>
          </Link>
          
        </Box>
      ))}
    </Grid>
  );
};

export default TruckMonitoringPage;