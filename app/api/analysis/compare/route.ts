import "@/config/container";
import { NextRequest, NextResponse } from 'next/server';
import { container } from 'tsyringe';
import { CompareConsumptionBetweenDevicesDTO, DevicesEnergyConsumptionRecordsDTO } from "@/src/infrastructure/api/dtos/analysis/analysis.dto";
import { AnalysisService } from "@/src/domain/services/analysis/AnalysisService";

export async function POST(req: NextRequest) {
  const analysisService = container.resolve(AnalysisService);
  try {
    const analysisDTO: CompareConsumptionBetweenDevicesDTO = await req.json();
    const dto: DevicesEnergyConsumptionRecordsDTO | null = await analysisService.compareConsumptionBetweenDevices(analysisDTO);
    if (!dto) throw new Error("It was not possible to get consumptions.");
    return NextResponse.json(dto, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to get consumptions.' }, { status: 500 });
  }
}