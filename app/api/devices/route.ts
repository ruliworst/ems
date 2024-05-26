import "reflect-metadata";
import "@/config/container";
import { container } from "tsyringe";
import DeviceService from "@/application/services/devices/DeviceService";
import { NextRequest, NextResponse } from "next/server";
import { DeviceDTO } from "@/dtos/devices/device.dto";

export async function GET() {
  const deviceService = container.resolve(DeviceService);
  try {
    const devices: DeviceDTO[] = await deviceService.getAll();
    return NextResponse.json(devices, { status: 200 })
  } catch (error) {
    console.error('Error fetching devices:', error);
    return NextResponse.json({ error: "Failed to fetch devices." }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const deviceService = container.resolve(DeviceService);
  try {
    const data: DeviceDTO = await req.json();
    const device = await deviceService.create(data);
    return NextResponse.json(device, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create device.' }, { status: 500 });
  }
}