import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface VariableChartProps {
  label: string;
  data: number[];
  unit: string;
  threshold?: {
    type: 'max' | 'min';
    value: number;
  };
  dates: string[];
}

const VariableChart: React.FC<VariableChartProps> = ({ label, data, unit, threshold, dates}) => {
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('es-Cl', { hour: '2-digit', minute: '2-digit' });
  };
  
  const chartData = {
    labels: dates.map((caca)=>{return formatDate(caca)}),
    datasets: [
      {
        label: `${label} (${unit})`,
        data: data,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderWidth: 1,
      },
      // Añadir el umbral como una línea horizontal si se define
      ...(threshold
        ? [
            {
              label: `Umbral ${threshold.type} (${unit})`,
              data: new Array(data.length).fill(threshold.value), // Línea horizontal en todo el gráfico
              borderColor: 'red', 
              borderWidth: 1, 
              pointRadius: 1, 
              fill: false, 
              tension: 1, 
            },
          ]
        : []),
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem: any) {
            return `${tooltipItem.dataset.label}: ${tooltipItem.raw} ${unit}`;
          },
        },
      },
    },

  };

  return (
    <div>
      <h2>{label}</h2>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default VariableChart;