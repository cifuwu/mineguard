"use client";

import React, { useState } from 'react';
import {  Flex, Grid, GridItem, Box, Text, IconButton, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, FormControl, FormLabel, Input, RadioGroup, Radio, Stack } from '@chakra-ui/react';
import { EditIcon, SettingsIcon } from '@chakra-ui/icons';
import VariableChart from './variableChart';
import ThresholdModal from './modalChart';

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedChart, setSelectedChart] = useState<string | null>(null);
  const [thresholdType, setThresholdType] = useState<'max' | 'min'>('max');
  const [thresholdValue, setThresholdValue] = useState<string>('');
  const [charts, setCharts] = useState<ChartData[]>(
    Object.entries(variables).map(([label, variable]) => ({
      label,
      data: [variable.value], 
      dates: [data.date],
      unit: variable.unit,
      // date: date,
    }))
  );

  const openModal = (label: string) => {
    setSelectedChart(label);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setThresholdType('max');
    setThresholdValue('');
  };

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

  return (
    <div style={{ padding: '100px' }}>
      
      <Text fontSize="xl" fontWeight="bold" pb={4}>Monitorización Camión {data.truck} {data.serie}</Text>

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
                onClick={() => openModal(chart.label)}
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

      <ThresholdModal
        isOpen={isModalOpen}
        onClose={closeModal}
        thresholdType={thresholdType}
        setThresholdType={setThresholdType}
        thresholdValue={thresholdValue}
        setThresholdValue={setThresholdValue}
        applyThreshold={applyThreshold}
      />
    </div>
  );
};

export default TruckGraphsGrid;
