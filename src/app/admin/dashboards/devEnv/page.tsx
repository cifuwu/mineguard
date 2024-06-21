'use client';

import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import TruckCounter from 'components/admin/dashboards/devEnv/truckCounter';
import AutoPred from 'components/admin/dashboards/devEnv/autoPred';
import autoPredData from 'variables/dashboards/default/autoPredData';
import HomeTimeline from 'components/admin/dashboards/devEnv/maintenanceCalendar';
import Events from 'components/admin/main/applications/calendar/Events';
// Chakra imports
import { Box, Flex, Grid, useColorModeValue } from '@chakra-ui/react';

const DevelopPage = () => {
  const paleGray = useColorModeValue('secondaryGray.400', 'whiteAlpha.100');
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
          gridTemplateRows={{
            md: 'repeat(2, 1fr)',
            '2xl': '1fr',
          }}
        >
          <Flex gridArea={{ md: '1 / 1 / 1 / 2', '2xl': '1 / 1 / 1 / 2' }}>
            <TruckCounter />
          </Flex>
          <Flex gridArea={{ md: '1 / 2 / 1 / 3', '2xl': '1 / 2 / 1 / 3' }}>
            <TruckCounter />
          </Flex>
          <Flex gridArea={{ md: '1 / 3 / 1 / 5', '2xl': '1 / 3 / 1 / 5' }}>
            <AutoPred tableData={autoPredData}/>
          </Flex>
        </Grid>
        <Grid
          gridTemplateColumns={{ base: '2.4fr 1fr', lg: '1fr 1.83fr' }}
          gap={{ base: '20px', xl: '20px' }}
          display={{ base: 'block', lg: 'grid' }}
        >
          <Box gridArea="2 / 1 / 2 / 4">
            <HomeTimeline/>
          </Box>
        </Grid>
      </Flex>

    </Flex>
  );
};

export default DevelopPage;