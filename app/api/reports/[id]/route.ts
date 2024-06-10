import "reflect-metadata";
import "@/config/container";
import { container } from "tsyringe";
import { NextRequest, NextResponse } from "next/server";
import { BaseReportService } from "@/src/domain/services/reports/BaseReportService";
import { ReportDTO } from "@/src/infrastructure/api/dtos/reports/report.dto";

const reportService = container.resolve(BaseReportService);

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    const report: ReportDTO | null = await reportService.getByPublicId(id);
    if (!report) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 });
    }
    return NextResponse.json(report, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch report' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const updateReportDTO = await req.json();
    const updatedReport: ReportDTO | null = await reportService.update(updateReportDTO);

    if (!updatedReport) {
      return NextResponse.json({ error: 'Report not found or update failed' }, { status: 404 });
    }

    return NextResponse.json(updatedReport, { status: 200 });
  } catch (error) {
    console.error("Error updating report:", error);
    return NextResponse.json({ error: 'Failed to update report' }, { status: 500 });
  }
}