import "@/config/container";
import { NextRequest, NextResponse } from 'next/server';
import { container } from 'tsyringe';
import { EnergyConsumptionRecordService } from "@/src/domain/services/energy-consumption-records/EnergyConsumptionRecordService";
import { EnergyConsumptionRecordEntity } from "@/src/infrastructure/entities/energy-consumption-records/EnergyConsumptionRecordEntity";

const energyConsumptionRecordService = container.resolve(EnergyConsumptionRecordService);

export async function GET(req: NextRequest, { params }: { params: { name: string } }) {
  const { name } = params;

  try {
    const record: EnergyConsumptionRecordEntity | null = await energyConsumptionRecordService.getRecordByDeviceName(name);
    return NextResponse.json(record.getDTO(), { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch a record.' }, { status: 500 });
  }
}