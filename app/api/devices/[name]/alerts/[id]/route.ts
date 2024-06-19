import "reflect-metadata";
import "@/config/container";
import { NextRequest, NextResponse } from 'next/server';
import { container } from 'tsyringe';
import { BaseAlertService } from "@/src/domain/services/alerts/BaseAlertService";
import { AlertViewDTO } from "@/src/infrastructure/api/dtos/alerts/alert.dto";

const alertService = container.resolve(BaseAlertService);

export async function PATCH(req: NextRequest, { params }: { params: { name: string, id: string } }) {
  const { name, id } = params;

  try {
    const resolvedAlert: AlertViewDTO | null = await alertService.resolve(id, name);

    if (!resolvedAlert) {
      return NextResponse.json({ error: 'Alert not found or resolution failed' }, { status: 404 });
    }

    return NextResponse.json(resolvedAlert, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    const deletedAlert: AlertViewDTO | null = await alertService.delete(id);
    if (!deletedAlert) {
      return NextResponse.json({ error: 'Alert not found' }, { status: 404 });
    }
    return NextResponse.json(deletedAlert, { status: 200 });
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: 'Failed to delete alert' }, { status: 500 });
  }
}