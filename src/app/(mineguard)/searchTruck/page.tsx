'use client';

import { Flex } from '@chakra-ui/react';
import Card from 'components/card/Card';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

import TrucksTable from 'components/search/TrucksTable';

const ENDPOINT = process.env.NEXT_PUBLIC_ENDPOINT;

const requestBodyGetTrucks = {
  query: `
    query GetTrucksResults {
      getTrucksResults {
        serie
        model
        driver
        driverID
        status
      }
    }
  `
};

const SearchTruckPage = () => {
  const searchParams = useSearchParams();
  const truck = searchParams.get("truck");
  const serie = searchParams.get("serie");
  console.log(truck, serie);

  const [trucksData, setTrucksData] = useState<any[]>([]);

  // Fetch GetTrucksResults
  useEffect(() => {

    fetch(ENDPOINT, {
      method: "POST",
      body: JSON.stringify(requestBodyGetTrucks),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.errors) {
          console.error("Error:", data.errors[0].message);
        }
        if (data && data.data && data.data.getTrucksResults) {
          console.log(data.data.getTrucksResults);
          setTrucksData(data.data.getTrucksResults);
          
          if (truck) {
            setTrucksData(prevData => {
              return prevData.filter(truck_ => truck_.model.toLowerCase().includes(truck.toLowerCase()));
            })
          }
          if (serie) {
            setTrucksData(prevData => {
              return prevData.filter(truck => truck.serie.toLowerCase().includes(serie.toLowerCase()));
            })
          }
        }
      })
      .catch((error) => {
        console.error("Error fetching trucks information:", error);
      });
  }, []);

  return (
    <Flex direction="column" pt={{ sm: '125px', lg: '75px' }}>
      <Card px="0px">
        <TrucksTable tableData={trucksData} />
      </Card>
    </Flex>
  );
};

export default SearchTruckPage;