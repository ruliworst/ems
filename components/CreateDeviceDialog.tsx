"use client";

import * as React from "react";
import { useState } from "react";
import { Calendar as CalendarIcon } from "lucide-react";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { CreateDeviceDTO, DeviceDTO } from "@/src/infrastructure/api/dtos/devices/device.dto";
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/components/ui/use-toast";
import { DeviceApiService } from "@/src/infrastructure/api/services/devices/DeviceApiService";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { TaskApiService } from "@/src/infrastructure/api/services/tasks/TaskApiService";
import { Frequency } from "@prisma/client";
import { TaskType } from "@/src/infrastructure/api/dtos/tasks/task.dto";

const createDeviceFormSchema = z.object({
  name: z.string()
    .min(2, { message: "The name must contain at least 2 characters." })
    .max(50),
  installationDate: z.date({ required_error: "The installation date is required." }),
  ratedPower: z.number()
    .min(1, { message: "The device must have at least 1 kWh of rated power." }),
  observations: z.string().optional(),
});

export default function CreateDeviceDialog({ onDeviceCreated }: { onDeviceCreated: (device: DeviceDTO) => void }) {
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(createDeviceFormSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      installationDate: null,
      ratedPower: 1,
      observations: ""
    },
  });

  const [opened, setOpened] = useState<boolean>(false);

  const onSubmit = async (values: any) => {
    const createDeviceDTO: CreateDeviceDTO = { ...values };

    await DeviceApiService.create(createDeviceDTO)
      .then(async device => {
        setOpened(false);
        toast({
          title: `${device.name} created`,
          description: `${new Date().toLocaleString()}`
        });
        onDeviceCreated(device);

        await TaskApiService
          .create({
            startDate: new Date().toISOString(),
            endDate: null,
            frequency: Frequency.EVERY_MINUTE,
            type: TaskType.MONITORIZE_CONSUMPTION,
            threshold: device.ratedPower,
            startReportDate: null,
            endReportDate: null,
            title: null,
            deviceName: device.name,
            operatorEmail: "bob.doe@example.com"
          })
          .then(task => {
            const description = `[${new Date().toLocaleTimeString()}]: An associated task was created to ${device.name} to generate energy consumption records.`
            toast({
              title: `Monitorize consumption task created`,
              description
            });
          });
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
          <Form {...form}>
            <form id="createDeviceForm" onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid gap-4 py-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <FormLabel className="text-right">Name</FormLabel>
                        <FormControl>
                          <Input {...field} className="col-span-3" />
                        </FormControl>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <div></div>
                        <FormMessage className="col-span-3" />
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="installationDate"
                  render={({ field }) => (
                    <FormItem>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <FormLabel className="text-right">Installation date</FormLabel>
                        <FormControl>
                          <Controller
                            name="installationDate"
                            control={form.control}
                            render={({ field }) => (
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    className="col-span-3 justify-start text-left font-normal"
                                  >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {field.value ? (field.value as Date).toDateString() : <span>Pick a date</span>}
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" id="installationDate">
                                  <Calendar
                                    mode="single"
                                    selected={field.value!}
                                    onSelect={field.onChange}
                                    initialFocus
                                  />
                                </PopoverContent>
                              </Popover>
                            )}
                          />
                        </FormControl>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <div></div>
                        <FormMessage className="col-span-3" />
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="ratedPower"
                  render={({ field }) => (
                    <FormItem>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <FormLabel className="text-right">Rated power (kWh)</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            required
                            className="col-span-3"
                            type="number"
                            min={1}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <div></div>
                        <FormMessage className="col-span-3" />
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="observations"
                  render={({ field }) => (
                    <FormItem>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <FormLabel className="text-right">Observations</FormLabel>
                        <FormControl>
                          <Textarea {...field} id="observations" name="observations" className="col-span-3 max-h-[200px]" />
                        </FormControl>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <div></div>
                        <FormMessage className="col-span-3" />
                      </div>
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter>
                <Button form="createDeviceForm" type="submit" disabled={!form.formState.isValid}>New</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      <Toaster />
    </>
  );
}