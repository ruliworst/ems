import "@/config/container";
import { NextRequest, NextResponse } from 'next/server';
import { container } from 'tsyringe';
import DeviceService from '@/src/domain/services/devices/DeviceService';
import { DeviceEntity } from "@/src/infrastructure/entities/devices/DeviceEntity";

const deviceService = container.resolve(DeviceService);

export async function GET(req: NextRequest, { params }: { params: { name: string } }) {
  const { name } = params;

  try {
    const device: DeviceEntity | null = await deviceService.getByName(name);
    if (!device) {
      return NextResponse.json({ error: 'Device not found' }, { status: 404 });
    }
    return NextResponse.json(device.getDeviceDTO(), { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch device' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { name: string } }) {
  const { name } = params;

  if (!name) {
    return NextResponse.json({ error: 'Device name is required' }, { status: 400 });
  }

  try {
    const device: DeviceEntity | null = await deviceService.delete(name);
    if (!device) {
      return NextResponse.json({ error: 'Device not found' }, { status: 404 });
    }
    return NextResponse.json(device.getDeviceDTO(), { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete device' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { name: string } }) {
  const { name } = params;

  try {
    const updateDeviceDTO = await req.json();
    const updatedDevice: DeviceEntity | null = await deviceService.update({
      originalName: name,
      name: updateDeviceDTO.name,
      ratedPower: updateDeviceDTO.ratedPower,
      installationDate: updateDeviceDTO.installationDate,
      observations: updateDeviceDTO.observations,
      lastMaintenance: updateDeviceDTO.lastMaintenance
    });

    if (!updatedDevice) {
      return NextResponse.json({ error: 'Device not found or update failed' }, { status: 404 });
    }

    return NextResponse.json(updatedDevice.getDeviceDTO(), { status: 200 });
  } catch (error) {
    console.error("Error updating device:", error);
    return NextResponse.json({ error: 'Failed to update device' }, { status: 500 });
  }
}
