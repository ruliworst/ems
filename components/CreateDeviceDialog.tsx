"use client";

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
import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Textarea } from "./ui/textarea";

export function CreateDeviceDialog() {
  const [date, setDate] = React.useState<Date>();

  return (
    <Dialog>
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
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input id="name" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="installationDate" className="text-right">
              Installation date
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[280px] justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
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
            <Input id="ratedPower" className="col-span-3" type="number" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="observations" className="text-right">
              Observations
            </Label>
            <Textarea id="observations" className="col-span-3 max-h-[200px]" />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">New</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
