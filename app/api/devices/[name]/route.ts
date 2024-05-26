import "@/config/container";
import { NextRequest, NextResponse } from 'next/server';
import { container } from 'tsyringe';
import DeviceService from '@/application/services/devices/DeviceService';

const deviceService = container.resolve(DeviceService);

export async function GET(req: NextRequest, { params }: { params: { name: string } }) {
  const { name } = params;

  try {
    const device = await deviceService.getByName(name);
    if (!device) {
      return NextResponse.json({ error: 'Device not found' }, { status: 404 });
    }
    return NextResponse.json(device, { status: 200 });
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
    const device = await deviceService.delete(name);
    return NextResponse.json(device, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete device' }, { status: 500 });
  }
}
