'use client';

import React, { useState, useEffect } from 'react';
import { Button, Flex, Text, Grid } from '@chakra-ui/react';
import TruckSelector from 'components/admin/dashboards/devPred/truckSelector';
import ComponentSelector from 'components/admin/dashboards/devPred/componentSelector';
import PredictionGenerator from 'components/admin/dashboards/devPred/predictionGenerator';
import Card from 'components/card/Card';
import TimelineItem from 'components/dataDisplay/TimelineItem';

const ENDPOINT = process.env.NEXT_PUBLIC_ENDPOINT;

const ManualPredictionPage = () => {
  const [selectedTruck, setSelectedTruck] = useState(null);
  const [selectedTruckId, setSelectedTruckId] = useState('');
  const [selectedComponents, setSelectedComponents] = useState([]);
  const [trucksAndComponentsData, setTrucksAndComponentsData] = useState<any | null>(null);
  const [manualPredictionData, setManualPredictionData] = useState<any | null>(null);
  
  
  const weekDay = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

  useEffect(() => {
    // getTrucksAndComponents RequestBody
    const requestBody = {
      query: `
        query GetTrucksAndComponents {
          getTrucksAndComponents {
            truckID
            name
            components {
              componentID
              name
            }
          }
        }
      `,
    };
  
    // Fetch getTrucksAndComponents
    fetch(ENDPOINT, {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data && data.data && data.data.getTrucksAndComponents) {
          console.log(data.data.getTrucksAndComponents);
          setTrucksAndComponentsData(data.data.getTrucksAndComponents);
        }
      })
      .catch((error) => {
        console.error("Error fetching Trucks and Components Info:", error);
      });
  }, []);

  const handleTruckSelect = (truckID) => {
    const truck = trucksAndComponentsData.find(truck => truck.truckID === truckID);
    setSelectedTruck(truck);
    setSelectedComponents([]);
    setSelectedTruckId(truck.truckID);
    console.log(truck.truckID);
  };

  const handleComponentSelect = (componentID) => {
    console.log(componentID);
    if (selectedComponents.includes(componentID)) {
      setSelectedComponents(
        selectedComponents.filter((id) => id !== componentID),
      );
    } else {
      setSelectedComponents([...selectedComponents, componentID]);
    }
  };

  const handleGeneratePrediction = () => {
    // Lógica para generar la predicción
    console.log('Componentes seleccionados:', selectedComponents, selectedTruckId);

    const requestBody = {
      query: `
          query MyQuery {
            getManualPrediction(listComponentID: ${JSON.stringify(selectedComponents)}, truckID: "${selectedTruckId}") {
                componentID
                name
                predictedDate
            }
            }
        `,
    };
  
    // Fetch getManualPrediction
    fetch(ENDPOINT, {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data && data.data && data.data.getManualPrediction) {
          console.log(data.data.getManualPrediction);
          setManualPredictionData(data.data.getManualPrediction);
        }
      })
      .catch((error) => {
        console.error("Error fetching Trucks and Components Info:", error);
      });
  };


  return (
    <Flex direction={{ base: 'column', xl: 'row' }} pt={{ base: '130px', md: '80px', xl: '80px' }} >
      <Flex direction="column" width="stretch">
        <Grid
          gap="40px"
          gridTemplateColumns={{
            md: 'repeat(8, 1fr)',
            '2xl': 'repeat(8, 1fr)',
          }}
        >
          <Flex gridArea={{ md: '1 / 2 / 1 / 4', '2xl': '1 / 2 / 1 / 4' }}>
            {trucksAndComponentsData ? (
              <TruckSelector trucks={trucksAndComponentsData} selectedTruck={selectedTruck} onSelectTruck={handleTruckSelect} />
            ) : (
              <Card>Cargando...</Card>
            )}
          </Flex>
            {selectedTruck && (
              <Flex gridArea={{ md: '1 / 4 / 1 / 6', '2xl': '1 / 4 / 1 / 6' }}>
                <ComponentSelector
                  components={selectedTruck.components}
                  onSelectComponent={handleComponentSelect}
                />
              </Flex>
            )}
          <Flex gridArea={{ md: '1 / 6 / 1 / 7', '2xl': '1 / 6 / 1 / 7' }}>
            <Flex direction="column">
            {selectedComponents.length > 0 && (
              <Button 
                mb={5}
                py={7}
                colorScheme="blue"
                onClick={handleGeneratePrediction}>
                Generar Predicción
              </Button>
            )}
            {manualPredictionData != null && (
              manualPredictionData.map((item, index) => (
                <Flex key={index} justifyContent="space-between" alignItems="center" w="100%">
                  <Text mr={8}>{item.name}</Text>
                  <TimelineItem
                    title={''}
                    day={new Date(item.predictedDate).getDate().toString()}
                    weekday={weekDay[new Date(item.predictedDate).getDay()]}
                    hours={new Date(item.predictedDate).toTimeString().slice(0,5)}
                    current={true}
                    w="200px"
                    my={1}
                  />
                </Flex>
              ))
            )}
            </Flex>
          </Flex>
        </Grid>
      </Flex>
    </Flex>
  );
};

export default ManualPredictionPage;
