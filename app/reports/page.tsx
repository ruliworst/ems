"use client";

import "reflect-metadata";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { ReportViewDTO } from "@/src/infrastructure/api/dtos/reports/report.dto";
import { ReportApiService } from "@/src/infrastructure/api/services/reports/ReportApiService";

// TODO: Restyle the top layout.

// TODO: Use skeleton.
export default function ReportsView() {
  const [reports, setReports] = useState<ReportViewDTO[]>([]);

  useEffect(() => {
    async function loadReports() {
      try {
        // TODO: Replace email when login use case is implemented.
        const reports = await ReportApiService.fetchAllByOperatorEmail("bob.doe@example.com")
        setReports(reports);
      } catch (err: any) {
        console.error(err.message);
      }
    }

    loadReports();
  }, []);

  return (
    <div className="bg-gray-100 p-6 h-screen">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Reports</h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-black">Dereck Wilson</span>
            <div className="bg-gray-300 w-8 h-8 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
          </div>
        </div>
      </header>
      <div className="bg-white rounded-lg shadow p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-3/12">Title</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports.map(report => (
              <TableRow key={report.publicId}>
                <TableCell>{report.title}</TableCell>
                <TableCell>{report.startDate}</TableCell>
                <TableCell>{report.endDate}</TableCell>
                <TableCell>
                  <a href={`/reports/${report.publicId}`}>
                    <Button variant="secondary" className="hover:bg-gray-300"><i className="fa-solid fa-eye text-md"></i></Button>
                  </a>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};