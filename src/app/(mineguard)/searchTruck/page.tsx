'use client';

import { Flex } from '@chakra-ui/react';
import Card from 'components/card/Card';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

import TrucksTable from 'components/search/TrucksTable';

const ENDPOINT = process.env.NEXT_PUBLIC_ENDPOINT;

const SearchTruckPage = () => {
  const searchParams = useSearchParams();
  const truck = searchParams.get("truck");
  const serie = searchParams.get("serie");
  console.log(truck, serie);

  const [trucksData, setTrucksData] = useState<any[]>([]);

  const exampleData = [
    {
      truck: "model 1",
      serie: "A50001",
      driver: "Brandon Monsalve",
      state: "Operativo"
    },
    {
      truck: "model 2",
      serie: "A50002",
      driver: "Nicolás Vargas",
      state: "Inactivo"
    },
    {
      truck: "model 3",
      serie: "A50003",
      driver: "Claudio Inal",
      state: "Operativo"
    }
  ]

  return (
    <Flex direction="column" pt={{ sm: '125px', lg: '75px' }}>
      <Card px="0px">
        <TrucksTable tableData={exampleData} />
      </Card>
    </Flex>
  );
};

export default SearchTruckPage;