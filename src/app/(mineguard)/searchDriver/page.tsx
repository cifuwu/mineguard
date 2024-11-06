'use client';

import { Flex } from '@chakra-ui/react';
import Card from 'components/card/Card';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

import DriversTable from 'components/search/DriversTable'

const ENDPOINT = process.env.NEXT_PUBLIC_ENDPOINT;

const requestBodyGetDrivers = {
  query: `
    query GetDrivers {
      getDrivers {
        _id
        name
        contactNumber
        userType
      }
    }
  `
};

const SearchTruckPage = () => {
  const searchParams = useSearchParams();
  const name = searchParams.get("name");
  const number = searchParams.get("number");
  console.log(name, number);

  const [driversData, setDriversData] = useState<any[]>([]);

  // Fetch GetDrivers
  useEffect(() => {

    fetch(ENDPOINT, {
      method: "POST",
      body: JSON.stringify(requestBodyGetDrivers),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.errors) {
          console.error("Error:", data.errors[0].message);
        }
        if (data && data.data && data.data.getDrivers) {
          console.log(data.data.getDrivers);
          setDriversData(data.data.getDrivers);
          
          if (name) {
            setDriversData(prevData => {
              return prevData.filter(driver => driver.name.toLowerCase().includes(name.toLowerCase()));
            })
          }
          if (number) {
            setDriversData(prevData => {
              return prevData.filter(driver => driver.contactNumber.replace(/\D/g, '').includes(number.replace(/\D/g, '')));
            })
          }


        }
      })
      .catch((error) => {
        console.error("Error fetching drivers information:", error);
      });
  }, [name, number]);

  return (
    <Flex direction="column" pt={{ sm: '125px', lg: '75px' }}>
      <Card px="0px">
        <DriversTable tableData={driversData} />
      </Card>
    </Flex>
  );
};

export default SearchTruckPage;