import { EnergyConsumptionRecordDTO } from "@/src/infrastructure/api/dtos/energy-consumption-records/energy-consumption-record.dto";
import { AnalysisApiService } from "@/src/infrastructure/api/services/analysis/AnalysisApiService";
import { useEffect, useState } from "react";
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function CompareConsumptionChart({ firstDeviceRecords, secondDeviceRecords }: { firstDeviceRecords: EnergyConsumptionRecordDTO[], secondDeviceRecords: EnergyConsumptionRecordDTO[] }) {
  console.log(firstDeviceRecords)
  console.log(secondDeviceRecords)
  const data = {
    labels: firstDeviceRecords.map(record => new Date(record.recordDate).toLocaleTimeString()),
    datasets: [
      {
        label: `Energy Consumption of first device`,
        data: firstDeviceRecords.map(record => record.quantity),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
      },
      {
        label: `Energy Consumption of second device`,
        data: secondDeviceRecords.map(record => record.quantity),
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Energy Consumption Over Time',
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Time',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Quantity',
        },
      },
    },
  };

  return (
    <div className="p-6 col-span-2">
      <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold">Comparing consumption</h2>
        <Line data={data} options={options} />
      </div>
    </div>
  );
}
