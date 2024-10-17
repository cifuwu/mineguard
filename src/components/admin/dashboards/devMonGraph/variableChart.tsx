import React, { useRef } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Chart } from 'chart.js';

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

const VariableChart: React.FC<VariableChartProps> = ({ label, data, unit, threshold, dates }) => {
  const chartRef = useRef<any>(null);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('es-Cl', { hour: '2-digit', minute: '2-digit' });
  };

  const chartData = {
    labels: dates.map((date) => formatDate(date)),
    datasets: [
      {
        label: `${label} (${unit})`,
        data: data,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderWidth: 1,
      },
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
      crosshairPlugin: {
        lineColor: 'rgba(0, 0, 0, 0.5)', // Color de las líneas
        lineWidth: 1, // Ancho de las líneas
      },
    },
    interaction: {
      mode: 'nearest',
      intersect: false,
    },
  };

  // Agregar el plugin personalizado para el crosshair
  const crosshairPlugin = {
    id: 'crosshairPlugin',
    afterDraw: (chart: any) => {
      if (chart.tooltip?._active && chart.tooltip._active.length) {
        const ctx = chart.ctx;
        const x = chart.tooltip._active[0].element.x;
        const y = chart.tooltip._active[0].element.y;
        const topY = chart.scales.y.top;
        const bottomY = chart.scales.y.bottom;
        const leftX = chart.scales.x.left;
        const rightX = chart.scales.x.right;

        // Dibujar línea vertical
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(x, topY);
        ctx.lineTo(x, bottomY);
        ctx.lineWidth = options.plugins.crosshairPlugin.lineWidth;
        ctx.strokeStyle = options.plugins.crosshairPlugin.lineColor;
        ctx.stroke();
        ctx.restore();

        // Dibujar línea horizontal
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(leftX, y);
        ctx.lineTo(rightX, y);
        ctx.lineWidth = options.plugins.crosshairPlugin.lineWidth;
        ctx.strokeStyle = options.plugins.crosshairPlugin.lineColor;
        ctx.stroke();
        ctx.restore();
      }
    },
  };

  // Registrar el plugin
  ChartJS.register(crosshairPlugin);

  return (
    <div>
      <h2>{label}</h2>
      <Line ref={chartRef} data={chartData}  />
    </div>
  );
};

export default VariableChart;
