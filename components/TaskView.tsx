import * as React from "react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { TaskDTO } from "@/src/infrastructure/api/dtos/tasks/task.dto";
import { Frequency } from "@prisma/client";
import { Command, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { Calendar as CalendarIcon, CheckIcon } from "lucide-react";
import { CaretSortIcon } from "@radix-ui/react-icons";

export default function TaskView({ task }: { task: TaskDTO }) {
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

  const { toast } = useToast();
  const router = useRouter();
  const [startDate, setStartDate] = useState<Date | undefined>(new Date(task.startDate));
  const [endDate, setEndDate] = useState<Date | undefined>(task.endDate ? new Date(task.endDate) : undefined);
  const [frequency, setFrequency] = useState<Frequency>(task.frequency);
  const [openFrequencies, setOpenFrequencies] = useState(false);
  const [threshold, setThreshold] = useState(task.threshold || undefined);
  const [startReportDate, setStartReportDate] = useState<Date | undefined>(
    task.startReportDate ? new Date(task.startReportDate) : undefined
  );
  const [endReportDate, setEndReportDate] = useState<Date | undefined>(
    task.endReportDate ? new Date(task.endReportDate) : undefined
  );
  const [title, setTitle] = useState(task.title || undefined);
  const [isEditing, setIsEditing] = useState(false);

  const handleSelectFrequency = (currentFrequency: string) => {
    const selectedFrequency = frequencies.find((f) => f.value.toString() === currentFrequency)!.value;
    setFrequency(selectedFrequency);
    setOpenFrequencies(false);
  };

  return (
    <>
      <div className="w-10/12 p-6">
        <h2 className="text-xl font-bold">Task</h2>
        <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
          <form id="updateTaskForm">
            <div className="grid grid-cols-4 gap-12">
              <div className="grid grid-cols-2 items-center gap-4">
                <Label htmlFor="startDate" className="text-right">Start Date</Label>
                {isEditing ? (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn("justify-start text-left font-normal", !startDate && "text-muted-foreground")}
                        type="button"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? startDate.toDateString() : <span>Pick a date</span>}
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
                ) : (
                  <Input id="startDate" value={startDate?.toDateString()} readOnly />
                )}
              </div>
              <div className="grid grid-cols-2 items-center gap-4">
                <Label htmlFor="endDate" className="text-right">End Date</Label>
                {isEditing ? (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn("justify-start text-left font-normal", !endDate && "text-muted-foreground")}
                        type="button"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? endDate.toDateString() : <span>Pick a date</span>}
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
                ) : (
                  <Input id="endDate" value={endDate?.toDateString()} readOnly />
                )}
              </div>
              <div className="grid grid-cols-2 items-center gap-4">
                <Label htmlFor="frequency" className="text-right">
                  Frequency
                </Label>
                {isEditing ? (
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
                ) : (
                  <Input id="frequency" value={frequency} readOnly />
                )}
              </div>
              <div className="space-x-4 flex justify-end">
                <Button variant="outline" onClick={() => setIsEditing(!isEditing)} type="button">
                  <i className="fa-solid fa-pen"></i>
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger>
                    <Button variant="outline" type="button">
                      <i className="fa-solid fa-trash"></i>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure to delete the task?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the task
                        and remove the data from our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                <Button variant="outline" type="button">
                  <i className="fa-solid fa-chart-line"></i>
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-12 mt-4">
              {threshold && (
                <div className="grid grid-cols-2 items-center gap-4">
                  <Label htmlFor="threshold" className="text-right">Threshold</Label>
                  <div className="flex items-center">
                    <Input
                      id="threshold"
                      type="number"
                      value={threshold}
                      onChange={(e) => setThreshold(Number(e.target.value))}
                      className={cn("mr-2", isEditing ? "bg-white" : "")}
                      readOnly={!isEditing}
                    />
                  </div>
                </div>
              )}
              {startReportDate && (
                <div className="grid grid-cols-2 items-center gap-4">
                  <Label htmlFor="startReportDate" className="text-right">Start Report Date</Label>
                  {isEditing ? (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn("justify-start text-left font-normal", !startReportDate && "text-muted-foreground")}
                          type="button"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {startReportDate ? startReportDate.toDateString() : <span>Pick a date</span>}
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
                  ) : (
                    <Input id="startReportDate" value={startReportDate?.toDateString()} readOnly />
                  )}
                </div>
              )}
              {endReportDate && (
                <div className="grid grid-cols-2 items-center gap-4">
                  <Label htmlFor="endReportDate" className="text-right">End Report Date</Label>
                  {isEditing ? (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn("justify-start text-left font-normal", !endReportDate && "text-muted-foreground")}
                          type="button"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {endReportDate ? endReportDate.toDateString() : <span>Pick a date</span>}
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
                  ) : (
                    <Input id="endReportDate" value={endReportDate?.toDateString()} readOnly />
                  )}
                </div>
              )}
            </div>
            <div className="grid grid-cols-4 gap-12 mt-4">
              {title && (
                <div className="col-span-2 grid grid-cols-2 items-center gap-4">
                  <Label htmlFor="title" className="text-left">Title</Label>
                  <div className="flex items-center col-span-2">
                    <Input
                      id="title"
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className={cn("mr-2", isEditing ? "bg-white" : "")}
                      readOnly={!isEditing}
                    />
                  </div>
                </div>
              )}
            </div>
            {isEditing && (
              <div className="flex justify-center mt-6">
                <Button form="updateTaskForm" type="submit">Save</Button>
              </div>
            )}
          </form>
        </div>
      </div>
      <Toaster />
    </>
  );
}
