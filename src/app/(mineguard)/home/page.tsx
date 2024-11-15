'use client';

import dynamic from "next/dynamic";
import type { FC } from "react";

const TruckMap = dynamic(() => import("components/map/TruckMap"), {
  loading: () => <p>El mapa está cargando...</p>,
  ssr: false,
}) as FC;

const MapPage: FC = () => {
  return (
    <div>
      <TruckMap />
    </div>
  );
};

export default MapPage;
