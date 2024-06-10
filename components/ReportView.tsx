import * as React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { ReportDTO } from "@/src/infrastructure/api/dtos/reports/report.dto";
import { Textarea } from "./ui/textarea";
import { cn } from "@/lib/utils";

export default function ReportView({ report }: { report: ReportDTO }) {
  console.log(report)
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [observations, setObservations] = useState(report.observations);

  const handleAddObservations = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <>
      <div className="w-10/12 p-6">
        <h2 className="text-xl font-bold">Report</h2>
        <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
          <div className="flex justify-between">
            <h2 className="text-xl font-semibold">{report.title}</h2>
            <Button variant="outline" onClick={() => setIsEditing(!isEditing)} type="button">
              <i className="fa-solid fa-pen"></i>
            </Button>
          </div>
          <form id="updateReport" onSubmit={handleAddObservations} className="mt-8">
            <div className="flex gap-12">
              <div className="grid grid-cols-2 items-center gap-4">
                <Label htmlFor="startDate" className="text-right">Start Date</Label>
                <Input id="startDate" value={report.startDate} readOnly />
              </div>
              <div className="grid grid-cols-2 items-center gap-4">
                <Label htmlFor="endDate" className="text-right">End Date</Label>
                <Input id="endDate" value={report.endDate} readOnly />
              </div>
              {report.threshold && (
                <div className="grid grid-cols-2 items-center gap-4">
                  <Label htmlFor="threshold" className="text-right">Threshold</Label>
                  <Input
                    id="threshold"
                    type="number"
                    value={report.threshold}
                    className="mr-2"
                    readOnly={true}
                  />
                </div>
              )}
              {report.cost != undefined && report.cost != null && report.cost >= 0 && (
                <div className="grid grid-cols-2 items-center gap-4">
                  <Label htmlFor="cost" className="text-right">Cost</Label>
                  <Input
                    id="cost"
                    type="number"
                    value={report.cost}
                    className="mr-2"
                    readOnly={true}
                  />
                </div>
              )}
            </div>
            <div className="grid grid-cols-1 items-start gap-4 col-span-2 mt-12">
              <Label htmlFor="observations" className="text-left">Observations</Label>
              <Textarea
                id="observations"
                value={report.observations || ""}
                onChange={(e) => setObservations(e.target.value)}
                className={cn("w-1/2 resize-none", isEditing ? "bg-white" : "")}
                readOnly={!isEditing}
              />
            </div>
            {isEditing && (
              <div className="flex justify-center mt-6">
                <Button form="updateReport" type="submit">Save</Button>
              </div>
            )}
          </form>
        </div>
      </div>
      <Toaster />
    </>
  );
}
