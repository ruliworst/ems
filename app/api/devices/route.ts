import "reflect-metadata";
import "@/config/container";
import { container } from "tsyringe";
import DeviceService from "@/src/domain/services/devices/DeviceService";
import { NextRequest, NextResponse } from "next/server";
import { CreateDeviceDTO, DeviceDTO } from "@/src/infrastructure/api/dtos/devices/device.dto";
import { DeviceEntity } from "@/domain/model/Device";

export async function GET() {
  const deviceService = container.resolve(DeviceService);
  try {
    const devices: DeviceEntity[] = await deviceService.getAll();
    const deviceDTOs: DeviceDTO[] = devices.map<DeviceDTO>(device => device.getDeviceDTO());
    return NextResponse.json(deviceDTOs, { status: 200 })
  } catch (error) {
    console.error('Error fetching devices:', error);
    return NextResponse.json({ error: "Failed to fetch devices." }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const deviceService = container.resolve(DeviceService);
  try {
    const data: CreateDeviceDTO = await req.json();
    const device: DeviceEntity = await deviceService.create(data);
    return NextResponse.json(device.getDeviceDTO(), { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create device.' }, { status: 500 });
  }
}