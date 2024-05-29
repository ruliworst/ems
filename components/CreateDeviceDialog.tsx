"use client";

import * as React from "react";
import { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { DeviceApiService } from "@/adapters/services/devices/DeviceApiService";
import { CreateDeviceDTO, DeviceDTO } from "@/dtos/devices/device.dto";
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/components/ui/use-toast";

export default function CreateDeviceDialog({ onDeviceCreated }: { onDeviceCreated: (device: DeviceDTO) => void }) {
  const { toast } = useToast()
  const [opened, setOpened] = useState<boolean>(false);
  const [date, setDate] = useState<Date | undefined>();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = {
      name: formData.get("name"),
      installationDate: date,
      ratedPower: formData.get("ratedPower"),
      observations: formData.get("observations"),
    };

    const createDeviceDTO: CreateDeviceDTO = {
      name: data.name!.toString(),
      installationDate: data.installationDate!.toISOString(),
      ratedPower: Number(data.ratedPower!),
      observations: data.observations?.toString(),
    };

    await DeviceApiService.create(createDeviceDTO)
      .then(device => {
        setOpened(false);
        toast({
          title: `${device.name} created`,
          description: `${new Date().toLocaleString()}`
        });
        onDeviceCreated(device);
      });
  };

  return (
    <>
      <Dialog open={opened} onOpenChange={setOpened}>
        <DialogTrigger asChild>
          <Button><i className="fa-solid fa-plus pr-3"></i>Create device</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px] sm:max-h-[600px]">
          <DialogHeader>
            <DialogTitle>Create device</DialogTitle>
            <DialogDescription>
              Create a new device. Click new when you are done.
            </DialogDescription>
          </DialogHeader>
          <form id="createDeviceForm" onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input id="name" name="name" className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="installationDate" className="text-right">
                  Installation date
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant={"outline"}
                      className={cn(
                        "col-span-3 justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? date.toDateString() : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" id="installationDate">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="ratedPower" className="text-right">
                  Rated power (kWh)
                </Label>
                <Input id="ratedPower" name="ratedPower" className="col-span-3" type="number" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="observations" className="text-right">
                  Observations
                </Label>
                <Textarea id="observations" name="observations" className="col-span-3 max-h-[200px]" />
              </div>
            </div>
            <DialogFooter>
              <Button form="createDeviceForm" type="submit">New</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <Toaster />
    </>
  );
}