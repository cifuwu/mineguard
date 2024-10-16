'use client';

import { Flex } from '@chakra-ui/react';
import Card from 'components/card/Card';
import { useState, useEffect } from 'react';

import AlertsTable from 'components/alerts/AlertsTable';

const ENDPOINT = process.env.NEXT_PUBLIC_ENDPOINT;

const requestBody = {
  query: `
    query Alerts {
      alerts {
        truck
        serie
        driver
        contactNumber
        date
        component
        criticalVariable
        correctiveAction
        state
      }
    }
  `
};

const AlertsPage = () => {

  const [alertsData, setAlertsData] = useState<any[]>([]);
  
  // Fetch alerts
  useEffect(() => {

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
        if (data && data.data && data.data.alerts) {
          console.log(data.data.alerts);
          setAlertsData(data.data.alerts);
        }
      })
      .catch((error) => {
        console.error("Error fetching auto prediction config:", error);
      });
  }, []);

  return (
    <Flex direction="column" pt={{ sm: '125px', lg: '75px' }}>
      <Card px="0px">
        <AlertsTable tableData={alertsData} />
      </Card>
    </Flex>
  );
};

export default AlertsPage;
