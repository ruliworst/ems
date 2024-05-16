import { container } from "tsyringe";
import "reflect-metadata";
import DeviceService from "@/services/DeviceService";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const deviceService = container.resolve(DeviceService);

  try {
    const devices = await deviceService.getAllDevices();
    return NextResponse.json(devices, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch devices." }, { status: 500 })
  }
}