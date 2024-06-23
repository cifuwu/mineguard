'use client';

import React from 'react';
import { useState } from 'react'; 
import { ChakraProvider } from '@chakra-ui/react';
import TruckCounter from 'components/admin/dashboards/devEnv/truckCounter';
import AutoPred from 'components/admin/dashboards/devEnv/autoPred';
import HomeTimeline from 'components/admin/dashboards/devEnv/maintenanceCalendar';
import MaintenanceTable from 'components/admin/dashboards/devEnv/maintenanceTable';
// Chakra imports
import { Box, Flex, Grid, useColorModeValue } from '@chakra-ui/react';

const jsonData = [
  {
    date: "2024-06-19T00:00:00.000-04:00",
    trucks: [
      {
        truckID: 0,
        name: "Truck1",
        components: [
          {
            componentID: 0,
            name: "Amortiguador",
            priority: "Inmediata",
            maintenance: "Cambiar los amortiguadores",
            done: true,
          },
          {
            componentID: 1,
            name: "Frenos",
            priority: "Urgente",
            maintenance: "Cambiar pastillas de freno",
            done: false,
          },
          {
            componentID: 2,
            name: "Aceite",
            priority: "Moderada",
            maintenance: "Revisión y cambio de aceite",
            done: false,
          },
        ]
      },
      {
        truckID: 1,
        name: "Truck2",
        components: [
          {
            componentID: 3,
            name: "Amortiguador",
            priority: "Inmediata",
            maintenance: "Cambiar los amortiguadores",
            done: true,
          },
          {
            componentID: 4,
            name: "Frenos",
            priority: "Urgente",
            maintenance: "Cambiar pastillas de freno",
            done: false,
          },
        ]
      }
    ]
  },
  {
    date: "2024-06-20T00:00:00.000-04:00",
    trucks: [
      {
        truckID: 5,
        name: "Truck6",
        components: [
          {
            componentID: 9,
            name: "Amortiguador",
            priority: "Inmediata",
            maintenance: "Cambiar los amortiguadores",
            done: true,
          },
        ]
      },
      {
        truckID: 3,
        name: "Truck2",
        components: [
          {
            componentID: 7,
            name: "Amortiguador",
            priority: "Inmediata",
            maintenance: "Cambiar los amortiguadores",
            done: true,
          },
          {
            componentID: 4,
            name: "Frenos",
            priority: "Urgente",
            maintenance: "Cambiar pastillas de freno",
            done: false,
          },
        ]
      }
    ]
  }
];

const jsonAutoPredData = 
  {
    "frequency": 43200, // ts 12 h = 12*3600s = 43200s
    //"initDate": "YYYY-MM-DDTHH:MM:SS",
    "lastPredDate": "2024-06-19T06:00:00.000-04:00",
    "nextPredDate": "2024-06-19T18:00:00.000-04:00",
  }

const jsonTruckInfo = 
  {
    operative: [
      {
        truckID: 0,
        name: "Truck1"
      },
      {
        TruckID: 1,
        name: "Truck2"
      }
    ],
    idle: [
      {
        truckID: 5,
        name: "Truck6"
      },
      {
        truckID: 3,
        name: "Truck2"
      }
    ]
  }

const DevelopPage = () => {
  const paleGray = useColorModeValue('secondaryGray.400', 'whiteAlpha.100');

  const [selectedTruck, setSelectedTruck] = useState<any | null>(null);
  const [tableData, setTableData] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const handleTruckClick = (truck: any, date: string) => {
    setSelectedTruck(truck);
    setSelectedDate(date);
    const selectedTruckData = jsonData.find(entry => entry.date === date)?.trucks.find(t => t.truckID === truck.truckID);
    if (selectedTruckData) {
      setTableData(selectedTruckData.components.map((component: any) => ({
        component: component.name,
        priority: component.priority,
        maintenance: component.maintenance,
        done: component.done ? 'Sí' : 'No',
      })));
    } else {
      setTableData([]);
    }
  };

  return (
    <Flex
      direction={{ base: 'column', xl: 'row' }}
      pt={{ base: '130px', md: '80px', xl: '80px' }}
    >
      <Flex direction="column" width="stretch">
        <Grid
          gap="40px"
          gridTemplateColumns={{
            md: 'repeat(4, 1fr)',
            '2xl': 'repeat(4, 1fr)',
          }}
        >
          <Flex gridArea={{ md: '1 / 1 / 1 / 2', '2xl': '1 / 1 / 1 / 2' }}>
            <TruckCounter title="Máquinas operando" number={jsonTruckInfo.operative.length}/>
          </Flex>
          <Flex gridArea={{ md: '1 / 2 / 1 / 3', '2xl': '1 / 2 / 1 / 3' }}>
            <TruckCounter title="Máquinas en espera de mantención" number={jsonTruckInfo.idle.length}/>
          </Flex>
          <Flex gridArea={{ md: '1 / 3 / 1 / 5', '2xl': '1 / 3 / 1 / 5' }}>
            <AutoPred tableData={jsonAutoPredData}/>
          </Flex>
        </Grid>
        <Grid
          gridTemplateColumns={{ base: '2.4fr 1fr', lg: '1fr 1.83fr' }}
          gap={{ base: '20px', xl: '20px' }}
          display={{ base: 'block', lg: 'grid' }}
        >
          <Box gridArea="2 / 1 / 2 / 4">
            <HomeTimeline data={jsonData} onTruckClick={handleTruckClick}/>
          </Box>
        </Grid>
        <Grid
          gridTemplateColumns={{ base: '2.4fr 1fr', lg: '1fr 1.83fr' }}
          gap={{ base: '20px', xl: '20px' }}
          display={{ base: 'block', lg: 'grid' }}
        >
          {selectedTruck && selectedDate && (
            <Box mt={4} gridArea="2 / 1 / 2 / 4">
              <MaintenanceTable
                truckName={selectedTruck.name}
                tableData={tableData}
                truckDate={selectedDate}
              />
            </Box>
          )}
        </Grid>
      </Flex>
    </Flex>
  );
};

export default DevelopPage;