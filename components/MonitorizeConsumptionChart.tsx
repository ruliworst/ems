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

export default function MonitorizeConsumptionChart({ deviceName }: { deviceName: string }) {
  const [records, setRecords] = useState<EnergyConsumptionRecordDTO[]>([]);

  useEffect(() => {
    async function getConsumptionRecord() {
      try {
        const record: EnergyConsumptionRecordDTO = await AnalysisApiService.getRecordByDeviceName(deviceName);
        setRecords(prevRecords => {
          const updatedRecords = [...prevRecords, record];
          if (updatedRecords.length > 25) {
            updatedRecords.shift();
          }
          return updatedRecords;
        });
      } catch (err: any) {
        console.error(err.message);
      }
    }

    const intervalId = setInterval(getConsumptionRecord, 1000);

    return () => clearInterval(intervalId);
  }, [deviceName]);

  const data = {
    labels: records.map(record => new Date(record.recordDate).toLocaleTimeString()), // Show only the time
    datasets: [
      {
        label: 'Energy Consumption Quantity',
        data: records.map(record => record.quantity),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
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
        <h2 className="text-xl font-bold">Monitorizing consumption</h2>
        <Line data={data} options={options} />
      </div>
    </div>
  );
}