'use client';

import React, { useState, useEffect } from 'react';
import { Flex, Text, Grid } from '@chakra-ui/react';
import TruckSelector from 'components/admin/dashboards/devPred/truckSelector';
import ComponentSelector from 'components/admin/dashboards/devPred/componentSelector';
import PredictionGenerator from 'components/admin/dashboards/devPred/predictionGenerator';
import Card from 'components/card/Card';

const ENDPOINT = "https://32meb447dzee7itae6f6enkqsq.appsync-api.sa-east-1.amazonaws.com/graphql";
const API_KEY = "da2-hagplywtcnhr3hnq6cb63y4i2u";

const ManualPredictionPage = () => {
  const [selectedTruck, setSelectedTruck] = useState(null);
  const [selectedComponents, setSelectedComponents] = useState([]);
  const [trucksAndComponentsData, setTrucksAndComponentsData] = useState<any | null>(null);

  useEffect(() => {
    // getTrucksAndComponents RequestBody
    const requestBody = {
      query: `
          query MyQuery {
            getTrucksAndComponents {
                name
                truckID
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
        "X-Api-Key": API_KEY,
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
    console.log(truck);
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
    console.log('Componentes seleccionados:', selectedComponents);
    // Aquí iría la lógica para generar la predicción
  };

  return (
    <Flex direction={{ base: 'column', xl: 'row' }} pt={{ base: '130px', md: '80px', xl: '80px' }} >
      <Flex direction="column" width="stretch">
        <Grid
          gap="40px"
          gridTemplateColumns={{
            md: 'repeat(7, 1fr)',
            '2xl': 'repeat(7, 1fr)',
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
          <Flex gridArea={{ md: '1 / 6 / 1 / 6', '2xl': '1 / 6 / 1 / 6' }}>
            {selectedComponents.length > 0 && (
              <PredictionGenerator
                selectedComponents={selectedComponents}
                onGeneratePrediction={handleGeneratePrediction}
              />
            )}
          </Flex>
        </Grid>
      </Flex>
    </Flex>
  );
};

export default ManualPredictionPage;
