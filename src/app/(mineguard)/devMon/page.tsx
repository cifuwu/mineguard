"use client";

import React, { useState, useEffect } from 'react';
import { Grid, Box, Text, Flex, Icon } from '@chakra-ui/react';
import { FaArrowRight } from 'react-icons/fa';
import io from 'socket.io-client';

const SOCKET_URL = 'wss://ab7d-190-44-116-48.ngrok-free.app'; // Reemplaza con tu URL

const TruckMonitoringPage = () => {
  const [trucksData, setTrucksData] = useState([]);

  useEffect(() => {
    const websockets = [];
    
    for (let i = 50000; i <= 50020; i++) {
      const serie = `A${i}`;
      const socket = io(SOCKET_URL, {
        query: { serie } // Pasar la serie en la consulta
      });

      websockets.push(socket);
      
      socket.on('connect', () => {
        console.log(`Connected to series ${serie}`);
      });

      socket.on('message', (data) => {
        try {
          const msg = JSON.parse(data);

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
          setTrucksData((prevData) => [...prevData, truckData]);
        } catch (error) {
          console.error('Error parsing message data:', error);
        }
      });

      socket.on('disconnect', () => {
        console.log(`Disconnected from series ${serie}`);
      });
    }

    return () => {
      websockets.forEach((socket) => socket.disconnect());
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
