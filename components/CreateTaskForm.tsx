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
import { useEffect, useState } from "react";
import { CreateTaskDTO, TaskType, TaskViewDTO } from "@/dtos/tasks/task.dto";
import { Frequency } from "@prisma/client";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { Command, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { DeviceDTO } from "@/dtos/devices/device.dto";
import { DeviceApiService } from "@/adapters/services/devices/DeviceApiService";
import { TaskApiService } from "@/adapters/services/tasks/TaskApiService";


interface CreateTaskFormProps {
  type: TaskType;
  onTaskCreated: (taskViewDTO: TaskViewDTO) => void;
}

export default function CreateTaskForm({ type, onTaskCreated }: CreateTaskFormProps) {
  const [devices, setDevices] = useState<DeviceDTO[]>([]);

  useEffect(() => {
    async function loadDevices() {
      try {
        const devices = await DeviceApiService.fetchAll()
        setDevices(devices);
      } catch (err: any) {
        console.error(err.message);
      }
    }

    loadDevices();
  }, []);

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
  const [openFrequencies, setOpenFrequencies] = useState(false);
  const [frequency, setFrequency] = useState<Frequency | undefined>();
  const [openDevices, setOpenDevices] = useState(false);
  const [deviceName, setDeviceName] = useState<string | undefined>();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const createTaskDTO = getCreateTaskDTO(type, formData);

    await TaskApiService.create(createTaskDTO)
      .then(task => {
        onTaskCreated(task);
      });
  };

  const handleSelectFrequency = (currentFrequency: string) => {
    const selectedFrequency = frequencies.find(f => f.value.toString() === currentFrequency)?.value;
    setFrequency(selectedFrequency);
    setOpenFrequencies(false);
  };

  const handleSelectDevice = (deviceName: string) => {
    setDeviceName(deviceName);
    setOpenDevices(false);
  };

  const getCreateTaskDTO = (type: TaskType, formData: FormData): CreateTaskDTO => {
    let data;

    // TODO: Include operatorEmail field when CRUD operations for operators are available.
    if (type === TaskType.GENERATE_ANOMALIES_REPORT) {
      data = {
        startDate,
        endDate,
        frequency,
        type,
        threshold: formData.get("threshold"),
        startReportDate: startReportDate,
        endReportDate: endReportDate,
        title: formData.get("title"),
        deviceName: deviceName,
        operatorEmail: "bob.doe@example.com"
      };

      return {
        startDate: data.startDate!.toISOString(),
        endDate: data.endDate ? data.endDate.toISOString() : null,
        frequency: data.frequency!,
        type,
        threshold: Number(data.threshold),
        startReportDate: data.startReportDate!.toISOString(),
        endReportDate: data.endReportDate!.toISOString(),
        title: data.title ? data.title.toString() : null,
        deviceName: data.deviceName!.toString(),
        operatorEmail: data.operatorEmail!
      };
    } else if (type === TaskType.GENERATE_CONSUMPTION_REPORT) {
      data = {
        startDate,
        endDate,
        frequency,
        type,
        startReportDate: startReportDate,
        endReportDate: endReportDate,
        title: formData.get("title"),
        deviceName: deviceName,
        operatorEmail: "bob.doe@example.com"
      };

      return {
        startDate: data.startDate!.toISOString(),
        endDate: data.endDate ? data.endDate.toISOString() : null,
        frequency: data.frequency!,
        type,
        threshold: null,
        startReportDate: data.startReportDate!.toISOString(),
        endReportDate: data.endReportDate!.toISOString(),
        title: data.title ? data.title.toString() : null,
        deviceName: data.deviceName!.toString(),
        operatorEmail: data.operatorEmail!
      };
    } else if (type === TaskType.MAINTENANCE_DEVICE) {
      data = {
        startDate,
        endDate,
        frequency,
        type,
        deviceName: deviceName,
        operatorEmail: "bob.doe@example.com"
      };

      return {
        startDate: data.startDate!.toISOString(),
        endDate: data.endDate ? data.endDate.toISOString() : null,
        frequency: data.frequency!,
        type,
        threshold: null,
        startReportDate: null,
        endReportDate: null,
        title: null,
        deviceName: data.deviceName!.toString(),
        operatorEmail: data.operatorEmail!
      };
    } else if (type === TaskType.MONITORIZE_CONSUMPTION) {
      data = {
        startDate,
        endDate,
        frequency,
        type,
        threshold: formData.get("threshold"),
        deviceName: deviceName,
        operatorEmail: "bob.doe@example.com"
      };

      return {
        startDate: data.startDate!.toISOString(),
        endDate: data.endDate ? data.endDate.toISOString() : null,
        frequency: data.frequency!,
        type,
        threshold: Number(data.threshold),
        startReportDate: null,
        endReportDate: null,
        title: null,
        deviceName: data.deviceName!.toString(),
        operatorEmail: data.operatorEmail!
      };
    }

    throw new Error("The type of the task was not set or invalid.");
  }

  return (
    <>
      <form id="createTaskForm" onSubmit={handleSubmit}>
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
            <Popover open={openFrequencies} onOpenChange={setOpenFrequencies}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openFrequencies}
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
                          onSelect={handleSelectFrequency}
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
          <div className="grid grid-cols-3 items-center gap-4">
            <Label htmlFor="deviceName" className="text-right">
              Device
            </Label>
            <Popover open={openDevices} onOpenChange={setOpenDevices}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openDevices}
                  className={cn(frequency ? "justify-between" : "justify-end")}
                >
                  {devices
                    ? devices.find((d) => d.name === deviceName)?.name
                    : ""}
                  <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0">
                <Command>
                  <CommandList>
                    <CommandGroup>
                      {devices.map((d) => (
                        <CommandItem
                          id="deviceName"
                          key={d.name}
                          value={d.name}
                          onSelect={handleSelectDevice}
                        >
                          {d.name}
                          <CheckIcon
                            className={cn(
                              "ml-auto h-4 w-4",
                              deviceName === d.name ? "opacity-100" : "opacity-0"
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
        </div>
        <DialogFooter>
          <Button form="createTaskForm" type="submit">New</Button>
        </DialogFooter>
      </form>
    </>
  );
}
