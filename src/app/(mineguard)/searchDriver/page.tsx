'use client';

import { Flex } from '@chakra-ui/react';
import Card from 'components/card/Card';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

import DriversTable from 'components/search/DriversTable'

const ENDPOINT = process.env.NEXT_PUBLIC_ENDPOINT;

const SearchTruckPage = () => {
  const searchParams = useSearchParams();
  const name = searchParams.get("name");
  const number = searchParams.get("number");
  console.log(name, number);

  const [trucksData, setTrucksData] = useState<any[]>([]);

  const exampleData = [
    {
      name: "Brandon Monsalve",
      number: "+56 9 1234 4567",
      type: "Admin",
    },
    {
      name: "Nicolás Vargas",
      number: "+56 9 9876 5432",
      type: "Admin",
    },
    {
      name: "Claudio Inal",
      number: "+56 9 1234 9876",
      type: "User",
    }
  ]

  return (
    <Flex direction="column" pt={{ sm: '125px', lg: '75px' }}>
      <Card px="0px">
        <DriversTable tableData={exampleData} />
      </Card>
    </Flex>
  );
};

export default SearchTruckPage;