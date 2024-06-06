import "reflect-metadata";
import "@/config/container";
import { NextRequest, NextResponse } from 'next/server';
import { container } from 'tsyringe';
import { BaseAlertService } from "@/src/domain/services/alerts/BaseAlertService";
import { AlertViewDTO } from "@/src/infrastructure/api/dtos/alerts/alert.dto";


export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const alertService = container.resolve(BaseAlertService);
  const { id } = params;

  try {
    const resolvedAlert: AlertViewDTO | null = await alertService.resolve(id);

    if (!resolvedAlert) {
      return NextResponse.json({ error: 'Alert not found or resolution failed' }, { status: 404 });
    }

    return NextResponse.json(resolvedAlert, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}