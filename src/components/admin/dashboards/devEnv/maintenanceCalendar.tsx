

// Chakra imports
import { Grid, Flex, Text, useColorModeValue, Button } from '@chakra-ui/react';
// Custom components
import Card from 'components/card/Card';
import TimelineItem from 'components/dataDisplay/TimelineItem';

export default function HomeTimeline({ data, onTruckClick }: { data: any[], onTruckClick: (truck: any, date: string) => void }) {
	// Chakra Color Mode
	const textColor = useColorModeValue('secondaryGray.900', 'white');
    const camionColor = useColorModeValue('#32278D', 'navy.900');

    const handleTruckClick = (truck: any, date: string) => {
        onTruckClick(truck, date);
      };

    const weekDay = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
	return (
		<Card flexDirection="column" overflowX="auto" w="100%">
            <Text fontSize='2xl' fontWeight='700' color={textColor}>
                Calendario de Mantenciones
            </Text>
            <Flex justifyContent="baseline" whiteSpace="nowrap">
                <Text flex="0 0 300px" fontSize='md' fontWeight='500' color='secondaryGray.600' mb='20px' mt='10px'>
                    Fecha
                </Text>
                <Text fontSize='md' fontWeight='500' color='secondaryGray.600' mb='20px' ml={7} mt='10px'>
                    Camiones (Haga click para ver detalle)
                </Text>
            </Flex>
            <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                {data.map((item, index) => (
					<Flex key={index} gridArea={{ base: `${index + 1} / 1 / ${index + 1} / 2`, '2xl': `${index + 1} / 1 / ${index + 1} / 2` }}>
						<TimelineItem
							title={''}
							day={new Date(item.date).getDate().toString()}
							weekday={weekDay[new Date(item.date).getDay()]}
							hours={new Date(item.date).toTimeString().slice(0,5)}
							current={true}
                            w="300px"
						/>
                        <Flex direction="row" ml={4} alignItems="center">
                            {item.trucks.map((truck, truckIndex) => (
                                <Button
                                    key={truckIndex}
                                    bg={camionColor}
                                    px="30px"
                                    borderRadius="md"
                                    ml={4}
                                    height="85%"
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                    whiteSpace="nowrap"
                                    onClick={() => handleTruckClick(truck, item.date)}
                                >
                                    <Text fontSize="md" color="white" w="100%">
                                        {truck.name}
                                    </Text>
                                </Button>
                            ))}
                        </Flex>
					</Flex>
				))}
            </Grid>
		</Card>
	);
}
