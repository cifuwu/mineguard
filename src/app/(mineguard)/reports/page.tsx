'use client';

import { Flex } from '@chakra-ui/react';
import Card from 'components/card/Card';
import { useState, useEffect } from 'react';

import ReportsTable from 'components/reports/ReportsTable';

const ENDPOINT = process.env.NEXT_PUBLIC_ENDPOINT;

const requestBody = {
  query: `
    query PreviousReports {
      previousReports {
        _id
        generated
        author
        status
        downloadUrl
        config {
          from
          to
          includeTrucks
          trucks {
            serie
            includeAlerts
            alerts
            includeVarHistory
            varList
          }
          includeDrivers
          drivers {
            name
            lastname
            includeAlerts
            alerts
            includeActivityHistory
          }
          includeCsv
        }
      }
    }
  `
};

const getCookieValue = (name: string) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift();
};

const ReportsPage = () => {

  const [reportsData, setReportsData] = useState<any[]>([]);
  
  // Fetch previousReports
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
        if (data && data.data && data.data.previousReports) {
          console.log(data.data.previousReports);
          setReportsData(data.data.previousReports);
        }
      })
      .catch((error) => {
        console.error("Error fetching auto prediction config:", error);
      });
  }, []);

  const exampleData = [
      {
      id: '1',
      generated: '1900/10/10',
      author: 'Cris',
      config: {
        "from": "2010/01/01",
        "to": "2020/01/01",
        "includeTrucks": true,
        "trucks": [
          {
            "serie": "serie1",
            "includeAlerts": true,
            "alerts": ["Resuelto"],
            "includeVarHistory": true,
            "varList": ["Voltage"]
          },
          {
            "serie": "serie2",
            "includeAlerts": true,
            "alerts": ["Resuelto"],
            "includeVarHistory": true,
            "varList": ["Voltage", "Motor", "Voltage", "Motor", "Voltage"]
          }
        ],
        "includeDrivers": true,
        "drivers": [
          {
            "name": "Brandon",
            "includeAlerts": true,
            "alerts": ["Resuelto"],
            "includeActivityHistory": true
          }
        ],
        "includeCsv": true
      },
      state: 'Listo',
      download: 'link',
      actions: 'borrar'
    },
    {
      id: '2',
      generated: '1900/10/10',
      author: 'Cris',
      config: {
        from: '2010/01/01',
        to: '2020/01/01',
        includeTrucks: true,
        trucks: [
          {
            serie: 'serie1',
            includeAlerts: true,
            alerts: ['Resuelto'],
            includeVarHistory: true,
            varList: ['Voltage']
          },
          {
            serie: 'serie2',
            includeAlerts: true,
            alerts: ['Resuelto'],
            includeVarHistory: true,
            varList: ['Voltage']
          },
          {
            serie: 'serie3',
            includeAlerts: true,
            alerts: ['Resuelto'],
            includeVarHistory: true,
            varList: ['Voltage']
          },
          {
            serie: 'serie4',
            includeAlerts: true,
            alerts: ['Resuelto'],
            includeVarHistory: true,
            varList: ['Voltage']
          },
          {
            serie: 'serie5',
            includeAlerts: true,
            alerts: ['Resuelto'],
            includeVarHistory: true,
            varList: ['Voltage', 'Motor','Voltage', 'Motor','Voltage', 'Motor','Voltage', 'Motor','Voltage', 'Motor','Voltage', 'Motor','Voltage', 'Motor']
          }
        ],
        includeDrivers: true,
        drivers: [
          {
            name: 'Brandon',
            includeAlerts: true,
            alerts: ['Resuelto'],
            includeActivityHistory: true
          }
        ],
        includeCsv: true
      },
      state: 'Generando',
      download: 'link',
      actions: 'borrar'
    }
  ]



  return (
    <Flex direction="column" pt={{ sm: '125px', lg: '75px' }}>
      <Card px="0px">
        <ReportsTable tableData={reportsData} />
      </Card>
    </Flex>
  )
};

export default ReportsPage;