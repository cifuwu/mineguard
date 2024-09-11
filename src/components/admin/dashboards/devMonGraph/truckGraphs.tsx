"use client";

import React, { useEffect, useState } from 'react';
import {  Flex, Grid, GridItem, Box, Text, IconButton, Button, Icon, useColorModeValue } from '@chakra-ui/react';import { EditIcon, SettingsIcon } from '@chakra-ui/icons';
import VariableChart from 'components/admin/dashboards/devMonGraph/variableChart';
import { ImCog } from "react-icons/im";
import GraphConfigModal from 'components/admin/dashboards/devMonGraph/graphConfigModal';
import ThresholdModal from 'components/admin/dashboards/devMonGraph/thresholdModal';

const ENDPOINT = process.env.NEXT_PUBLIC_ENDPOINT;

interface Variable {
  value: number;
  unit: string;
}

interface Props {
  data: {
    truck: string;
    variables: Record<string, Variable>;
    serie: string;
    date: string;
  };
}

interface ChartData {
  label: string;
  data: number[];
  dates: string[];
  unit: string;
  threshold?: {
    type: 'max' | 'min';
    value: number;
  };
}

const TruckGraphsGrid: React.FC<Props> = ({ data }) => {
  const variables = data.variables;
  // const date = data.date;
  const textColorSecondary = useColorModeValue('secondaryGray.700', 'white');
  const boxBg = useColorModeValue('secondaryGray.400', 'whiteAlpha.100');
  const [selectedChart, setSelectedChart] = useState<string | null>(null);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);

  const [isThresholdModalOpen, setIsThresholdModalOpen] = useState(false);
  const [thresholdLabel, setThresholdLabel] = useState('');
  const [thresholdUnit, setThresholdUnit] = useState('');

  const [variableConfig, setVariableConfig] = useState([]);  // Umbrales

  const [charts, setCharts] = useState<ChartData[]>(
    Object.entries(variables).map(([label, variable]) => ({
      label,
      data: [variable.value], 
      dates: [data.date],
      unit: variable.unit,
      // date: date,
    }))
  );

  useEffect(() => {
    const updatedCharts = charts.map((chart) => {
      const variable = variables[chart.label];
      if (variable) {
        const updatedData = [...chart.data, variable.value].slice(-10);  // Mantiene solo los últimos 8 valores
        const updatedDates = [...chart.dates, data.date].slice(-10);  // Mantiene solo las últimas 8 fechas
        return {
          ...chart,
          data: updatedData,
          dates: updatedDates,
        };
      }
      return chart;
    });
  
    setCharts(updatedCharts);
  }, [data]);
  
  
  
  useEffect(()=>{
    console.log(charts);
  },[charts])

  /*
  const applyThreshold = () => {
    if (selectedChart !== null && thresholdValue !== '') {
      const updatedCharts = charts.map((chart) =>
        chart.label === selectedChart
          ? {
              ...chart,
              threshold: {
                type: thresholdType,
                value: Number(thresholdValue),
              },
            }
          : chart
      );
      setCharts(updatedCharts);
    }
    closeModal();
  };
  */

  const openConfigurationModal = () => {
    setIsConfigModalOpen(true);
  }
  const closeConfigModal = () => {
    setIsConfigModalOpen(false);
  };
  const openThresholdModal = (label, unit) => {
    setThresholdLabel(label);
    setThresholdUnit(unit);
    setIsThresholdModalOpen(true);
  }
  const closeThresholdModal = () => {
    setIsThresholdModalOpen(false);
  };
  
  useEffect(() => {

    const requestBody = {
      query: `
        query VariableConfig {
          variableConfig {
            variable
            unit
            threshold {
              visible
              value
            }
            maximum {
              visible
              value
            }
          }
        }
      `,
    };
    
    // fetch variableConfig
    fetch(ENDPOINT, {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.errors) {
          console.error("Error:", data.errors[0].message);
        }
        if (data && data.data && data.data.variableConfig) {
          console.log(data.data.variableConfig);
          setVariableConfig(data.data.variableConfig);
        }
      })
      .catch((error) => {
        console.log("Error:", error);
      });

  }, []);

  const findVariableConfig = (label: string, config: any) => {
    return config.find((item: any) => item.variable === label);
  };
  const currentConfig = findVariableConfig(thresholdLabel, variableConfig);

  const handleSave = (newValues: {
    maxThreshold: number;
    minThreshold: number;
    isMaxThresholdVisible: boolean;
    isMinThresholdVisible: boolean;
  }) => {
    console.log('Valores guardados:', newValues);

    const updatedConfig = variableConfig.map((config) =>
      config.variable === thresholdLabel
        ? {
            ...config,
            threshold: {
              ...config.threshold,
              value: newValues.minThreshold,
              visible: newValues.isMinThresholdVisible,
            },
            maximum: {
              ...config.maximum,
              value: newValues.maxThreshold,
              visible: newValues.isMaxThresholdVisible,
            },
          }
        : config
    );
    setVariableConfig(updatedConfig);
  };

  return (
    <div style={{ padding: '100px' }}>
      
      <Flex justifyContent="space-between">
        <Text fontSize="xl" fontWeight="bold" pb={4}>Monitorización Camión {data.truck} {data.serie}</Text>
        <Button
            bg={boxBg}
            fontSize="sm"
            fontWeight="500"
            color={textColorSecondary}
            borderRadius="7px"
            onClick={openConfigurationModal}
            >
            <Icon
              as={ImCog}
              color={textColorSecondary}
              me="4px"
            />
            Configurar gráficos
          </Button>
      </Flex>

      <Grid templateColumns="repeat(auto-fill, minmax(300px, 1fr))" gap={6}>
        {charts.map((chart, index) => (
          
          <GridItem key={index}>
            <Box
              p={4}
              bg="#FFFFFF"
              boxShadow="lg"
              borderRadius="xl"
              borderWidth="1px"
              borderColor="gray.200"
              position="relative"
            >
              <IconButton
                icon={<EditIcon />}
                size="sm"
                position="absolute"
                top={2}
                right={2}
                onClick={() => openThresholdModal(chart.label, chart.unit)}
                aria-label="Edit chart"
              />
              <VariableChart
                label={chart.label}
                data={chart.data}
                unit={chart.unit}
                threshold={chart.threshold}
                dates = {chart.dates}
              />
            </Box>
          </GridItem>
        ))}
      </Grid>

      {currentConfig && ( <ThresholdModal 
        isOpen={isThresholdModalOpen} 
        onClose={closeThresholdModal} 
        label={thresholdLabel} 
        unit={thresholdUnit}
        maxThreshold={currentConfig.maximum.value}
        minThreshold={currentConfig.threshold.value}
        isMaxThresholdVisible={currentConfig.maximum.visible}
        isMinThresholdVisible={currentConfig.threshold.visible}
        onSave={handleSave}/>
      )}
      <GraphConfigModal isOpen={isConfigModalOpen} onClose={closeConfigModal} />
    </div>
  );
};

export default TruckGraphsGrid;