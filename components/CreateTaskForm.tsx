import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import { TaskType } from "@/dtos/tasks/task.dto";
import { Frequency } from "@prisma/client";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { Command, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";

interface CreateTaskFormProps {
  type: TaskType;
}

export default function CreateTaskForm({ type }: CreateTaskFormProps) {
  const frequencies = [
    {
      value: Frequency.DAILY,
      label: "Daily",
    },
    {
      value: Frequency.WEEKLY,
      label: "Weekly",
    },
    {
      value: Frequency.MONTHLY,
      label: "Monthly",
    },
  ];

  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [startReportDate, setStartReportDate] = useState<Date | undefined>();
  const [endReportDate, setEndReportDate] = useState<Date | undefined>();
  const [open, setOpen] = useState(false);
  const [frequency, setFrequency] = useState<Frequency | undefined>();

  const handleSelect = (currentFrequency: string) => {
    const selectedFrequency = frequencies.find(f => f.value.toString() === currentFrequency)?.value;
    setFrequency(selectedFrequency);
    setOpen(false);
  };

  return (
    <form id="createTaskForm">
      <div className="grid gap-4 py-4">
        <div className={cn(
          "grid grid-cols-3 items-center gap-4",
          (type !== TaskType.GENERATE_CONSUMPTION_REPORT && type !== TaskType.GENERATE_ANOMALIES_REPORT) && "hidden")}>
          <Label htmlFor="title" className="text-right">Title</Label>
          <Input id="title" name="title" className="col-span-2" />
        </div>
        <div className="grid grid-cols-3 items-center gap-4">
          <Label htmlFor="startDate" className="text-right">
            Start date
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant={"outline"}
                className={cn(
                  "col-span-1 justify-start text-left font-normal",
                  !startDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" id="startDate">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={setStartDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="grid grid-cols-3 items-center gap-4">
          <Label htmlFor="endDate" className="text-right">
            End date
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant={"outline"}
                className={cn(
                  "col-span-1 justify-start text-left font-normal",
                  !endDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" id="endDate">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={setEndDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="grid grid-cols-3 items-center gap-4">
          <Label htmlFor="frequency" className="text-right">
            Frequency
          </Label>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className={cn(frequency ? "justify-between" : "justify-end")}
              >
                {frequency
                  ? frequencies.find((f) => f.value === frequency)?.label
                  : ""}
                <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0">
              <Command>
                <CommandList>
                  <CommandGroup>
                    {frequencies.map((f) => (
                      <CommandItem
                        id="frequency"
                        key={f.value}
                        value={f.value.toString()}
                        onSelect={handleSelect}
                      >
                        {f.label}
                        <CheckIcon
                          className={cn(
                            "ml-auto h-4 w-4",
                            frequency === f.value ? "opacity-100" : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
        <div className={cn(
          "grid grid-cols-3 items-center gap-4",
          (type !== TaskType.MONITORIZE_CONSUMPTION && type !== TaskType.GENERATE_ANOMALIES_REPORT) && "hidden")}>
          <Label htmlFor="threshold" className="text-right">
            Threshold (kWh)
          </Label>
          <Input id="threshold" name="threshold" className="col-span-1" type="number" required={type === TaskType.MONITORIZE_CONSUMPTION || type === TaskType.GENERATE_ANOMALIES_REPORT} />
        </div>
        <div className={cn(
          "grid grid-cols-3 items-center gap-4",
          (type !== TaskType.GENERATE_CONSUMPTION_REPORT && type !== TaskType.GENERATE_ANOMALIES_REPORT) && "hidden")}>
          <Label htmlFor="startReportDate" className="text-right">
            Start report date
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant={"outline"}
                className={cn(
                  "col-span-1 justify-start text-left font-normal",
                  !startReportDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startReportDate ? format(startReportDate, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" id="startReportDate">
              <Calendar
                mode="single"
                selected={startReportDate}
                onSelect={setStartReportDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className={cn(
          "grid grid-cols-3 items-center gap-4",
          (type !== TaskType.GENERATE_CONSUMPTION_REPORT && type !== TaskType.GENERATE_ANOMALIES_REPORT) && "hidden")}>
          <Label htmlFor="endReportDate" className="text-right">
            End report date
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant={"outline"}
                className={cn(
                  "col-span-1 justify-start text-left font-normal",
                  !endReportDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {endReportDate ? format(endReportDate, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" id="endReportDate">
              <Calendar
                mode="single"
                selected={endReportDate}
                onSelect={setEndReportDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <DialogFooter>
        <Button form="createTaskForm" type="submit">New</Button>
      </DialogFooter>
    </form>
  );
}
