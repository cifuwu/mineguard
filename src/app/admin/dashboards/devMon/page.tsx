'use client';

import React from 'react';
import { Grid, Box, Text, Flex, Icon} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { FaArrowRight } from 'react-icons/fa'; 

const mockTrucksData = [
  {
    truck: "830E-1",
    serie: "B60088",
    conductor: "Rodrigo Vargas",
    serviceTime: 45,
    position: {
      lat: -1,
      lon: 3
    },
    phone: "+56 9 8765 4321",
    date: "2024-09-05T10:10:00.000Z",
    variables: {
      "Velocidad": {
        "value": 28,
        "unit": "km/h"
      },
      "Voltaje batería": {
        "value": 310,
        "unit": "V"
      },
      "Presión frenos": {
        "value": 25,
        "unit": "kPa"
      },
      "Altitud": {
        "value": 950,
        "unit": "m"
      }
    }
  },
  {
    truck: "730E-4",
    serie: "C70099",
    conductor: "Mónica Espinoza",
    serviceTime: 72,
    position: {
      lat: 2,
      lon: -2
    },
    phone: "+56 9 5678 1234",
    date: "2024-09-05T11:15:00.000Z",
    variables: {
      "Velocidad": {
        "value": 35,
        "unit": "km/h"
      },
      "Voltaje batería": {
        "value": 290,
        "unit": "V"
      },
      "Presión frenos": {
        "value": 22,
        "unit": "kPa"
      },
      "Altitud": {
        "value": 1200,
        "unit": "m"
      }
    }
  },
  {
    truck: "785D-2",
    serie: "D80012",
    conductor: "Francisco Medina",
    serviceTime: 58,
    position: {
      lat: 3,
      lon: 1
    },
    phone: "+56 9 1234 5678",
    date: "2024-09-05T12:20:00.000Z",
    variables: {
      "Velocidad": {
        "value": 32,
        "unit": "km/h"
      },
      "Voltaje batería": {
        "value": 295,
        "unit": "V"
      },
      "Presión frenos": {
        "value": 19,
        "unit": "kPa"
      },
      "Altitud": {
        "value": 1100,
        "unit": "m"
      }
    }
  },
  {
    truck: "960E-2",
    serie: "E90023",
    conductor: "Carmen Reyes",
    serviceTime: 65,
    position: {
      lat: -2,
      lon: 4
    },
    phone: "+56 9 4321 8765",
    date: "2024-09-05T13:25:00.000Z",
    variables: {
      "Velocidad": {
        "value": 27,
        "unit": "km/h"
      },
      "Voltaje batería": {
        "value": 285,
        "unit": "V"
      },
      "Presión frenos": {
        "value": 23,
        "unit": "kPa"
      },
      "Altitud": {
        "value": 1050,
        "unit": "m"
      }
    }
  },
  {
    truck: "730E-5",
    serie: "F10034",
    conductor: "Miguel Paredes",
    serviceTime: 63,
    position: {
      lat: 1,
      lon: -3
    },
    phone: "+56 9 6789 0123",
    date: "2024-09-05T14:30:00.000Z",
    variables: {
      "Velocidad": {
        "value": 33,
        "unit": "km/h"
      },
      "Voltaje batería": {
        "value": 315,
        "unit": "V"
      },
      "Presión frenos": {
        "value": 21,
        "unit": "kPa"
      },
      "Altitud": {
        "value": 1250,
        "unit": "m"
      }
    }
  },
  {
    truck: "785D-4",
    serie: "G20045",
    conductor: "Elena Soto",
    serviceTime: 70,
    position: {
      lat: -3,
      lon: 0
    },
    phone: "+56 9 3456 7890",
    date: "2024-09-05T15:35:00.000Z",
    variables: {
      "Velocidad": {
        "value": 29,
        "unit": "km/h"
      },
      "Voltaje batería": {
        "value": 305,
        "unit": "V"
      },
      "Presión frenos": {
        "value": 24,
        "unit": "kPa"
      },
      "Altitud": {
        "value": 1300,
        "unit": "m"
      }
    }
  },
  {
    truck: "830E-7",
    serie: "H30056",
    conductor: "Raúl Durán",
    serviceTime: 75,
    position: {
      lat: 0,
      lon: -4
    },
    phone: "+56 9 8765 3210",
    date: "2024-09-05T16:40:00.000Z",
    variables: {
      "Velocidad": {
        "value": 31,
        "unit": "km/h"
      },
      "Voltaje batería": {
        "value": 320,
        "unit": "V"
      },
      "Presión frenos": {
        "value": 18,
        "unit": "kPa"
      },
      "Altitud": {
        "value": 900,
        "unit": "m"
      }
    }
  },
  {
    truck: "960E-4",
    serie: "I40067",
    conductor: "Patricia Rojas",
    serviceTime: 68,
    position: {
      lat: 4,
      lon: -1
    },
    phone: "+56 9 7890 1234",
    date: "2024-09-05T17:45:00.000Z",
    variables: {
      "Velocidad": {
        "value": 36,
        "unit": "km/h"
      },
      "Voltaje batería": {
        "value": 275,
        "unit": "V"
      },
      "Presión frenos": {
        "value": 26,
        "unit": "kPa"
      },
      "Altitud": {
        "value": 1350,
        "unit": "m"
      }
    }
  },
  {
    truck: "730E-6",
    serie: "J50078",
    conductor: "Jorge Herrera",
    serviceTime: 62,
    position: {
      lat: -4,
      lon: 2
    },
    phone: "+56 9 0123 4567",
    date: "2024-09-05T18:50:00.000Z",
    variables: {
      "Velocidad": {
        "value": 34,
        "unit": "km/h"
      },
      "Voltaje batería": {
        "value": 330,
        "unit": "V"
      },
      "Presión frenos": {
        "value": 20,
        "unit": "kPa"
      },
      "Altitud": {
        "value": 1400,
        "unit": "m"
      }
    }
  },
  {
    truck: "785D-5",
    serie: "K60089",
    conductor: "Gabriela Suárez",
    serviceTime: 77,
    position: {
      lat: 3,
      lon: 0
    },
    phone: "+56 9 5678 9876",
    date: "2024-09-05T19:55:00.000Z",
    variables: {
      "Velocidad": {
        "value": 26,
        "unit": "km/h"
      },
      "Voltaje batería": {
        "value": 280,
        "unit": "V"
      },
      "Presión frenos": {
        "value": 27,
        "unit": "kPa"
      },
      "Altitud": {
        "value": 1450,
        "unit": "m"
      }
    }
  },
]

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
