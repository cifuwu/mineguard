'use client'
// Chakra imports
import { Grid, Flex, Text, useColorModeValue } from '@chakra-ui/react';
// Custom components
import Card from 'components/card/Card';
import TimelineItem from 'components/dataDisplay/TimelineItem';

//Data
import homeTimelineData from 'variables/dashboards/default/homeTimelineData';

export default function HomeTimeline(props: { [x: string]: any }) {
	const { ...rest } = props;
	// Chakra Color Mode
	const textColor = useColorModeValue('secondaryGray.900', 'white');
	return (
		<Card flexDirection="column" w="100%" {...rest} >
            <Text fontSize='2xl' fontWeight='700' color={textColor}>
                Calendario de Mantenciones
            </Text>
            <Text fontSize='md' fontWeight='500' color='secondaryGray.600' mb='20px' mt='10px'>
                Fecha
            </Text>
            <Grid templateColumns="repeat(5, 1fr)" gap={4}>
                {homeTimelineData.map((item, index) => (
					<Flex key={index} gridArea={{ base: `${index + 1} / 1 / ${index + 1} / 2`, '2xl': `${index + 1} / 1 / ${index + 1} / 2` }}>
						<TimelineItem
							mb="16px"
							title={item.title || ''}
							day={item.day}
							weekday={item.weekday}
							hours={item.hours}
							current={item.current}
						/>
					</Flex>
				))}
            </Grid>
		</Card>
	);
}
