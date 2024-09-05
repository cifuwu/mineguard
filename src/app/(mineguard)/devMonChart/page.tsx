'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import TruckGraphsGrid from 'components/admin/dashboards/devMonGraph/truckGraphs';
const SOCKET_URL = 'wss://ab7d-190-44-116-48.ngrok-free.app/ws';


interface TruckData {
  truck: string;
  serie: string;
  conductor: string;
  serviceTime: string;
  date: string;
  position: {
    lat: number;
    lon: number;
  };
  variables: any; // Puedes ajustar esto según la estructura de las variables
}



const TruckMonitoringGraphs = () => {
  const [selectedTruckData, setSelectedTruckData] = useState<TruckData | undefined>();

  const params = new URLSearchParams(window.location.search);
  const serie = params.get('serie');

  useEffect(()=>{
    const socket = new WebSocket(`${SOCKET_URL}?serie=${serie}`);

    socket.onmessage = (event) => {
      const data = event.data;
      const msg = JSON.parse(data);


      const truckData: TruckData = {
        truck: msg.truck,
        serie: msg.serie,
        conductor: msg.conductor,
        serviceTime: msg.serviceTime, 
        date: msg.date,
        position: {
          lat: msg.position.lat,
          lon: msg.position.lon
        },
        variables: msg.variables
      };

      //console.log(truckData);

      setSelectedTruckData(truckData);
    };

    socket.onclose = () => {
      console.log('WebSocket cerrado');
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  },[])


  // useEffect(()=>{
  //   console.log(selectedTruckData);
  // },[selectedTruckData])
  
  
  return (
    <div>
      {selectedTruckData ? (
        <TruckGraphsGrid data={selectedTruckData} />
      ) : (
        <p>No se encontró información para la serie especificada.</p>
      )}
    </div>
  );
};

export default TruckMonitoringGraphs;