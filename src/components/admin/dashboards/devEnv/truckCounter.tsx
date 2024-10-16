'use client';

import React from 'react';

// Chakra imports
import { Flex, Box, Icon, Text, useColorModeValue } from '@chakra-ui/react';
import LineChart from 'components/charts/LineChart';

// Custom components
import Card from 'components/card/Card';
import Menu from 'components/menu/MainMenu';
import IconBox from 'components/icons/IconBox';

import {
    lineChartDataProjectStatus,
    lineChartOptionsProjectStatus,
  } from 'variables/charts';

// Assets
import { MdOutlineShoppingBasket } from 'react-icons/md';

type TruckCounterProps = {
  title: string;
  number: string | number;
};

const TruckCounter: React.FC<TruckCounterProps> = ({ title, number }) => {
    // Chakra Color Mode
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const iconColor = useColorModeValue('brand.500', 'white');
  const iconBoxBg = useColorModeValue('secondaryGray.300', 'navy.700');

  const newOptions = {
    ...lineChartOptionsProjectStatus,
    colors: ['var(--chakra-colors-brand-500)', '#39B8FF'],
  };

  return (
    <Card alignItems="center" flexDirection="column" w="100%">
      <Flex justify="space-between" px="10px" pt="5px" mb="30px" align="center" w="100%">
        <Text color={textColor} fontSize="lg" fontWeight="700" lineHeight="100%">
          {title}
        </Text>
        <Menu />
      </Flex>
      <Flex justifyContent="center" alignItems="center" w="100%" px="10px">
        <Flex direction="column" align="start" mx="auto">
          <Text color={textColor} fontSize="120px" me="6px" fontWeight="700">
            {number}
          </Text>
        </Flex>
      </Flex>
    </Card>
  );
};

export default TruckCounter;