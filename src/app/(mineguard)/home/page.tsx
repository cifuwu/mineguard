'use client';

import React from 'react';
import { useState, useEffect } from 'react'; 
import { ChakraProvider } from '@chakra-ui/react';
import TruckCounter from 'components/admin/dashboards/devEnv/truckCounter';
import AutoPred from 'components/admin/dashboards/devEnv/autoPred';
import HomeTimeline from 'components/admin/dashboards/devEnv/maintenanceCalendar';
import MaintenanceTable from 'components/admin/dashboards/devEnv/maintenanceTable';
import Card from 'components/card/Card';
// Chakra imports
import { Box, Flex, Grid, useColorModeValue } from '@chakra-ui/react';

// Aws
const ENDPOINT = process.env.NEXT_PUBLIC_ENDPOINT;

const DevelopPage = () => {

  const [selectedTruck, setSelectedTruck] = useState<any | null>(null);
  const [tableData, setTableData] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [autoPredData, setAutoPredData] = useState<any | null>(null);
  const [trucksInfoData, setTrucksInfoData] = useState<any | null>(null);
  const [calendarData, setCalendarData] = useState<any | null>(null);

  useEffect(() => {
    // getTrucksInfo RequestBody
    const requestBody = {
        query: `
          query GetTrucksInfo {
            getTrucksInfo {
              idle {
                truckID
                name
                components {
                  componentID
                  name
                }
              }
              operative {
                truckID
                name
                components {
                  componentID
                  name
                }
              }
            }
          }
      `,
    };
  
    // Fetch getTrucksInfo
    fetch(ENDPOINT, {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data && data.data && data.data.getTrucksInfo) {
          setTrucksInfoData(data.data.getTrucksInfo);
        }
      })
      .catch((error) => {
        console.error("Error fetching Trucks Info:", error);
      });
  }, []);
  
  useEffect(() => {
    // getAutoPredConfig RequestBody
    const requestBody = {
      query: `
        query GetAutoPredConfig {
          getAutoPredConfig {
            frequency
            lastPredDate
            nextPredDate
          }
        }
      `,
    };

    // Fetch autoPredConfig
    fetch(ENDPOINT, {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data && data.data && data.data.getAutoPredConfig) {
          setAutoPredData(data.data.getAutoPredConfig);
        }
      })
      .catch((error) => {
        console.error("Error fetching auto prediction config:", error);
      });
  }, []);

  useEffect(() => {
    const initialDate = "2024-08-28";
    const lastDate = "2024-10-01";

    // getTrucksInfo RequestBody
    const requestBody = {
      query: `
        query GetCalendar($initialDate: String, $lastDate: String) {
          getCalendar(initialDate: $initialDate, lastDate: $lastDate) {
            date
            trucks {
              truckID
              name
              components {
                maintenanceID
                componentID
                name
                priority
                maintenance
                done
              }
            }
          }
        }
      `,
      variables: {
        "initialDate": initialDate,
        "lastDate": lastDate
      }
    };
  
    // Fetch getTrucksInfo
    fetch(ENDPOINT, {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data && data.data && data.data.getCalendar) {
          setCalendarData(data.data.getCalendar);
        }
      })
      .catch((error) => {
        console.error("Error fetching Calendar Info:", error);
      });
  }, []);
  console.log(calendarData);

  const handleTruckClick = (truck: any, date: string) => {
    setSelectedTruck(truck);
    setSelectedDate(date);
    const selectedTruckData = calendarData.find(entry => entry.date === date)?.trucks.find(t => t.truckID === truck.truckID);
    if (selectedTruckData) {
      setTableData(selectedTruckData.components.map((component: any) => ({
        component: component.name,
        priority: component.priority,
        maintenance: component.maintenance,
        done: component.done,
        maintenanceID: component.maintenanceID,
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
            {trucksInfoData ? (
              <TruckCounter title="Máquinas operando" number={trucksInfoData.operative.length}/>
            ) : (
              <Card>Cargando...</Card>
            )}
          </Flex>
          <Flex gridArea={{ md: '1 / 2 / 1 / 3', '2xl': '1 / 2 / 1 / 3' }}>
            {trucksInfoData ? (
              <TruckCounter title="Máquinas en espera de mantención" number={trucksInfoData.idle.length}/>
            ) : (
              <Card>Cargando...</Card>
            )}
          </Flex>
          <Flex gridArea={{ md: '1 / 3 / 1 / 5', '2xl': '1 / 3 / 1 / 5' }}>
          {autoPredData ? (
              <AutoPred tableData={autoPredData}/>
            ) : (
              <Card>Cargando configuración de predicción...</Card>
            )}
          </Flex>
        </Grid>
        <Grid
          gridTemplateColumns={{ base: '2.4fr 1fr', lg: '1fr 1.83fr' }}
          gap={{ base: '20px', xl: '20px' }}
          display={{ base: 'block', lg: 'grid' }}
        >
          <Box gridArea="2 / 1 / 2 / 4">
            {calendarData ? (
              <HomeTimeline data={calendarData} onTruckClick={handleTruckClick}/>
            ) : (
              <Card>Cargando...</Card>
            )}
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