"use client";

import DeviceView from '@/components/DeviceView'
import { Progress } from '@/components/ui/progress';
import { AlertViewDTO } from '@/src/infrastructure/api/dtos/alerts/alert.dto';
import { DeviceDTO } from '@/src/infrastructure/api/dtos/devices/device.dto';
import { AlertApiService } from '@/src/infrastructure/api/services/alerts/AlertApiService';
import { DeviceApiService } from '@/src/infrastructure/api/services/devices/DeviceApiService';
import { useEffect, useState } from 'react';

export default function DevicePage({ params }: { params: { name: string } }) {
  const name = params.name;
  const [device, setDevice] = useState<DeviceDTO>();
  const [alerts, setAlerts] = useState<AlertViewDTO[]>([]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    async function getDevice() {
      try {
        const device = await DeviceApiService.fetchByName(name!);
        setDevice(device);
        setProgress(50);

        const fetchedAlerts = await AlertApiService.fetchAllByDeviceName(name);
        setAlerts(fetchedAlerts);
        setProgress(90);
      } catch (err: any) {
        console.error(err.message);
      } finally {
        setProgress(100);
      }
    }

    getDevice();
  }, [name]);

  if (progress < 100) {
    return (
      <div className="w-screen h-screen flex justify-center p-12">
        <Progress value={progress} />
      </div>
    );
  }

  if (device && alerts.length > 0) {
    return <DeviceView device={device} fetchedAlerts={alerts} />;
  }

  return <div>No data available</div>;
}