import "reflect-metadata";
import "@/config/container";
import { container } from "tsyringe";
import { NextRequest, NextResponse } from "next/server";
import { BaseReportService } from "@/src/domain/services/reports/BaseReportService";

const reportService = container.resolve(BaseReportService);

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.json({ error: 'Email query parameter is required' }, { status: 400 });
  }

  try {
    const reports = await reportService.getAllByOperatorEmail(email);
    if (!reports || reports.length === 0) {
      return NextResponse.json({ error: 'No reports found for the provided email' }, { status: 404 });
    }
    return NextResponse.json(reports, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch reports:', error);
    return NextResponse.json({ error: 'Failed to fetch reports' }, { status: 500 });
  }
}