import "reflect-metadata";
import "@/config/container";
import { container } from "tsyringe";
import DeviceService from "@/application/services/DeviceService";
import { NextResponse } from "next/server";
import { DeviceDTO } from "@/dtos/device.dto";

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