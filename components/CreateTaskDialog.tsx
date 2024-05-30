"use client";

import * as React from "react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import CreateTaskForm from "./CreateTaskForm";
import { TaskType, TaskViewDTO } from "@/src/infrastructure/api/dtos/tasks/task.dto";

export default function CreateTaskDialog({ onTaskCreated }: { onTaskCreated: (task: TaskViewDTO) => void }) {
  const taskTypes = [
    {
      value: TaskType.GENERATE_ANOMALIES_REPORT,
      label: "Generate anomalies report",
    },
    {
      value: TaskType.GENERATE_CONSUMPTION_REPORT,
      label: "Generate consumption report",
    },
    {
      value: TaskType.MAINTENANCE_DEVICE,
      label: "Maintenance device",
    },
    {
      value: TaskType.MONITORIZE_CONSUMPTION,
      label: "Monitorize consumption",
    },
  ];

  const { toast } = useToast();
  const [opened, setOpened] = useState<boolean>(false);
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<TaskType | undefined>();

  const handleSelect = (currentType: string) => {
    const taskType = taskTypes.find(t => t.value.toString() === currentType)?.value;
    setType(taskType);
    setOpen(false);
  };

  const handleTaskCreated = (task: TaskViewDTO) => {
    toast({
      title: "Task created.",
      description: `${new Date().toLocaleString()}`
    });
    onTaskCreated(task);
    setOpened(false);
  }

  return (
    <>
      <Dialog open={opened} onOpenChange={setOpened}>
        <DialogTrigger asChild>
          <Button><i className="fa-solid fa-plus pr-3"></i>Create task</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px] sm:max-h-[600px]">
          <DialogHeader>
            <DialogTitle>Create task</DialogTitle>
            <DialogDescription>
              Create a new task. Click new when you are done.
            </DialogDescription>
          </DialogHeader>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-1/2 justify-between"
              >
                {type !== undefined
                  ? taskTypes.find((t) => t.value === type)?.label
                  : "Select a type..."}
                <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0">
              <Command>
                <CommandList>
                  <CommandGroup>
                    {taskTypes.map((t) => (
                      <CommandItem
                        key={t.value}
                        value={t.value.toString()}
                        onSelect={handleSelect}
                      >
                        {t.label}
                        <CheckIcon
                          className={cn(
                            "ml-auto h-4 w-4",
                            type === t.value ? "opacity-100" : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          {type !== undefined && <CreateTaskForm type={type} onTaskCreated={handleTaskCreated} />}
        </DialogContent>
      </Dialog>
      <Toaster />
    </>
  );
}
