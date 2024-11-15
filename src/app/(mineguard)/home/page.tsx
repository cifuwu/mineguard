'use client'

import dynamic from "next/dynamic";
import { useMemo } from "react";

const MapPage = () => {
  const TruckMap = useMemo(() => dynamic(
    () => import("components/map/TruckMap"),
    {
      loading: () => <p>El mapa está cargando...</p>,
      ssr: false
    }
  ), [])
  return (
    <div>
      <TruckMap />
    </div>
  );
};

export default MapPage;
