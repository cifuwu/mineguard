import React from 'react';
import TruckGraphsGrid from '../../../../components/admin/dashboards/devMonGraph/truckGraphs';

const mockData = {
  truck: "980E-5",
  serie: "A50077",
  conductor: "Sebastián Cifuentes",
  serviceTime: 60,
  position: {
    lat: 0,
    lon: 0
  },
  phone: "+56 9 1313 6969",
  date: "2024-09-05T10:0:00.000Z",
  variables: {
    "Velocidad": {
      "value": 30,
      "unit": "km/h"
    },
    "Voltaje batería": {
      "value": 300,
      "unit": "V"
    },
    "Presión frenos": {
      "value": 20,
      "unit": "kPa"
    },
    "Altitud": {
      "value": 1000,
      "unit": "m"
    }
  }
};

const TruckMonitoringGraphs = () => {
  return (
    <div>
      <TruckGraphsGrid data={mockData} />
    </div>
  );
};

export default TruckMonitoringGraphs;
