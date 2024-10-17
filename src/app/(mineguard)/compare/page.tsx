'use client';

import React from 'react';
import { useState, useEffect } from 'react'; 
import { Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

import Card from 'components/card/Card';
// Chakra imports
import { Box, Flex, Grid, useColorModeValue, Text, Checkbox, Button } from '@chakra-ui/react';

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ENDPOINT = process.env.NEXT_PUBLIC_ENDPOINT;

const requestBodyTrucks = {
  query: `
    query AllTrucksNamesAndSerieAndVars {
      allTrucksNamesAndSerieAndVars {
        allTrucksNamesAndSerie {
          name
          serie
        }
        allVars
      }
    }
  `
};

const ComparisonPage = () => {
  const [trucks, setTrucks] = useState<any[]>([]);
  const [variables, setVariables] = useState<any[]>([]);
  const [compareData, setCompareData] = useState<any[]>([]);

  const [selectedSeries, setSelectedSeries] = useState([]);
  const [selectedVars, setSelectedVars] = useState([]);

  const handleTruckToggle = (serie) => {
    setSelectedSeries(prevSelectedSeries => {
      if (prevSelectedSeries.includes(serie)) {
        return prevSelectedSeries.filter(s => s !== serie);
      } else {
        return [...prevSelectedSeries, serie];
      }
    });
  };

  const handleVariableToggle = (variable) => {
    setSelectedVars(prevSelectedVars => {
      if (prevSelectedVars.includes(variable)) {
        return prevSelectedVars.filter(v => v !== variable);
      } else {
        return [...prevSelectedVars, variable];
      }
    });
  };

  useEffect(() => {
    fetch(ENDPOINT, {
      method: "POST",
      body: JSON.stringify(requestBodyTrucks),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.errors) {
          console.error("Error:", data.errors[0].message);
        }
        if (data && data.data && data.data.allTrucksNamesAndSerieAndVars.allTrucksNamesAndSerie) {
          setTrucks(data.data.allTrucksNamesAndSerieAndVars.allTrucksNamesAndSerie);
          setVariables(data.data.allTrucksNamesAndSerieAndVars.allVars);
        }
      })
      .catch((error) => {
        console.error("Error fetching trucks information:", error);
      });
  }, []);

  const handleRequestComparison = () => {
    const requestBodyComparePerformance = {
      query: `
        query ComparePerformance($trucksAndVars: TrucksAndVars) {
          comparePerformance(trucksAndVars: $trucksAndVars) {
            varName
            trucks
            values
            drivers
            series
          }
        }
      `,
      variables: {
        "trucksAndVars": {
          "series": selectedSeries,
          "vars": selectedVars
        }
      }
    };

    fetch(ENDPOINT, {
      method: "POST",
      body: JSON.stringify(requestBodyComparePerformance),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.errors) {
          console.error("Error:", data.errors[0].message);
        }
        if (data && data.data && data.data.comparePerformance) {
          setCompareData(data.data.comparePerformance);
        }
      })
      .catch((error) => {
        console.error("Error fetching information:", error);
      });
  };

  return (
    <>
      <Flex
        direction={{ base: 'column', xl: 'row' }}
        pt={{ base: '130px', md: '80px', xl: '80px' }}
        px={{ lg: '120px', xl: '15%' }}
      >
        <Flex width="stretch" gap={25} justifyContent="center">
          <Card maxH="500px" overflowY="auto">
            <Text fontSize="2xl" as="b">Camiones</Text>
            {trucks && trucks.map((truck, index) => (
              <Flex key={index} justify="space-between" align="center" mb={2}>
                <Text>{truck.name} - {truck.serie}</Text>
                <Checkbox
                  isChecked={selectedSeries.includes(truck.serie)}
                  onChange={() => handleTruckToggle(truck.serie)}
                />
              </Flex>
            ))}
          </Card>
          <Card maxH="500px" overflowY="auto">
            <Text fontSize="2xl" as="b">Variables</Text>
            {variables && variables.map((variable, index) => (
              <Flex key={index} justify="space-between" align="center" mb={2}>
                <Text>{variable}</Text>
                <Checkbox
                  isChecked={selectedVars.includes(variable)}
                  onChange={() => handleVariableToggle(variable)}
                />
              </Flex>
            ))}
          </Card>
        </Flex>
      </Flex>
      <Flex justifyContent="center" mt={4}>
        <Button
          borderRadius="16px"
          h="48px"
          px={10}
          variant="brand"
          color="white"
          fontSize="lg"
          fontWeight="500"
          _hover={{ bg: 'brand.600' }}
          _active={{ bg: 'brand.500' }}
          _focus={{ bg: 'brand.500' }}
          onClick={handleRequestComparison}
        >
          Comparar
        </Button>
      </Flex>

      {/* Renderizar gráficos de comparación */}
      {compareData && compareData.map((item, index) => (
        <Box key={index} mt={10} py={5} maxW="800px" height="300px" marginX='auto'> {/* Ajusta el tamaño aquí */}
          <Text fontSize="xl" as="b" mb={4}>
            Comparación para {item.varName}
          </Text>
          <Bar
            data={{
              labels: item.trucks.map((truck, idx) => `${truck} - ${item.series[idx]} - ${item.drivers[idx]}`), // Nombres de los camiones
              datasets: [
                {
                  label: item.varName,
                  data: item.values, // Valores de la variable
                  backgroundColor: 'rgba(75, 192, 192, 0.2)',
                  borderColor: 'rgba(75, 192, 192, 1)',
                  borderWidth: 1,
                },
              ],
            }}
            options={{
              indexAxis: 'y',
              maintainAspectRatio: false, // Permite cambiar la proporción
              scales: {
                x: {
                  beginAtZero: true,
                },
              },
              plugins: {
                legend: {
                  display: false,
                },
              },
            }}
          />
        </Box>
      ))}

    </>
  );
};

export default ComparisonPage;
