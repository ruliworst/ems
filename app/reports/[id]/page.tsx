"use client";

import ReportView from '@/components/ReportView';
import { ReportDTO } from '@/src/infrastructure/api/dtos/reports/report.dto';
import { ReportApiService } from '@/src/infrastructure/api/services/reports/ReportApiService';
import { useEffect, useState } from 'react';

export default function ReportPage({ params }: { params: { id: string } }) {
  const id = params.id;
  const [report, setReport] = useState<ReportDTO>();

  useEffect(() => {
    async function getDevice() {
      try {
        const fetchedReport = await ReportApiService.fetchByPublicId(id!);
        setReport(fetchedReport);
      } catch (err: any) {
        console.error(err.message);
      }
    }

    getDevice();
  }, []);

  if (report) {
    return <ReportView report={report!} />
  }

  return <></>;
}