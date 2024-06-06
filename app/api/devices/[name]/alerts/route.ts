import "@/config/container";
import { NextRequest, NextResponse } from 'next/server';
import { container } from 'tsyringe';
import { BaseAlertService } from "@/src/domain/services/alerts/BaseAlertService";
import { AlertViewDTO } from "@/src/infrastructure/api/dtos/alerts/alert.dto";

const alertService = container.resolve(BaseAlertService);

export async function GET(req: NextRequest, { params }: { params: { name: string } }) {
  const { name } = params;

  try {
    const alerts: AlertViewDTO[] | null = await alertService.getAllByDeviceName(name);
    if (!alerts) {
      return NextResponse.json({ error: 'Alerts not found for device.' }, { status: 404 });
    }
    return NextResponse.json(alerts, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch alerts for device.' }, { status: 500 });
  }
}


