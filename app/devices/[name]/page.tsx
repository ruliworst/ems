"use client";

import { DeviceApiService } from '@/adapters/services/devices/DeviceApiService';
import DeviceView from '@/components/DeviceView'
import { DeviceDTO } from '@/dtos/devices/device.dto';
import { useEffect, useState } from 'react';

export default function DevicePage({ params }: { params: { name: string } }) {
  const name = params.name;
  const [device, setDevice] = useState<DeviceDTO>();

  useEffect(() => {
    async function getDevice() {
      try {
        const device = await DeviceApiService.fetchByName(name!);
        console.log(device)
        setDevice(device);
      } catch (err: any) {
        console.error(err.message);
      }
    }

    getDevice();
  }, []);

  if (device) {
    return <DeviceView device={device!} onSave={() => console.log("Saving")} />
  }

  return <></>;
}