"use client";

import "reflect-metadata";
import { useEffect, useState } from "react";
import { DeviceApiService } from "@/src/infrastructure/api/services/devices/DeviceApiService";
import { Command, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { CalendarIcon, CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Label } from "@radix-ui/react-label";
import { Calendar } from "@/components/ui/calendar";
import { CompareConsumptionBetweenDevicesDTO, DevicesEnergyConsumptionRecordsDTO } from "@/src/infrastructure/api/dtos/analysis/analysis.dto";
import { AnalysisApiService } from "@/src/infrastructure/api/services/analysis/AnalysisApiService";
import CompareConsumptionChart from "@/components/CompareConsumptionChart";
import { EnergyConsumptionRecordDTO } from "@/src/infrastructure/api/dtos/energy-consumption-records/energy-consumption-record.dto";

// TODO: Restyle the top layout.

// TODO: Use skeleton.
export default function AnalysisView() {
  const [deviceNames, setDeviceNames] = useState<string[]>([]);
  const [selectedFirstDevice, setSelectedFirstDevice] = useState<string>();
  const [openFirstDeviceList, setOpenFirstDeviceList] = useState(false);
  const [selectedSecondDevice, setSelectedSecondDevice] = useState<string>();
  const [openSecondDeviceList, setOpenSecondDeviceList] = useState(false);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [showChart, setShowChart] = useState(false);
  const [firstDeviceRecords, setFirstDeviceRecords] = useState<EnergyConsumptionRecordDTO[]>([]);
  const [secondDeviceRecords, setSecondDeviceRecords] = useState<EnergyConsumptionRecordDTO[]>([]);

  useEffect(() => {
    async function loadDevices() {
      try {
        const devices = await DeviceApiService.fetchAll()
        setDeviceNames(devices.map(device => device.name));

      } catch (err: any) {
        console.error(err.message);
      }
    }

    loadDevices();
  }, []);

  const handleCompare = async () => {
    const compareConsumptionBetweenDevicesDTO: CompareConsumptionBetweenDevicesDTO = {
      firstDeviceName: selectedFirstDevice!,
      secondDeviceName: selectedSecondDevice!,
      startDate: startDate!.toISOString(),
      endDate: endDate!.toISOString(),
    };

    await AnalysisApiService.compareConsumptionBetweenDevices(compareConsumptionBetweenDevicesDTO)
      .then((value: DevicesEnergyConsumptionRecordsDTO) => {
        setShowChart(true);
        setFirstDeviceRecords(value.firstDeviceEnergyConsumptionRecords);
        setSecondDeviceRecords(value.secondDeviceEnergyConsumptionRecords);
        console.log(value);
      })
      .catch(error => console.error(error));
  };

  return (
    <div className="p-6 h-screen">
      <div className="bg-gray-100 p-6 rounded-lg shadow-lg flex flex-col gap-6">
        <h1 className="text-2xl font-bold">Analysis</h1>
        <div className="grid grid-cols-2 gap-4 w-4/12 items-center">
          <Label htmlFor="firstDevice" className="text-right">
            First Device
          </Label>
          <Popover open={openFirstDeviceList} onOpenChange={setOpenFirstDeviceList}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openFirstDeviceList}
                className={cn(selectedFirstDevice ? "justify-between" : "justify-end")}
              >
                {selectedFirstDevice}
                <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0" id="firstDevice">
              <Command>
                <CommandList>
                  <CommandGroup>
                    {deviceNames.filter(name => name !== selectedSecondDevice).map((deviceName) => (
                      <CommandItem
                        id="deviceName"
                        key={deviceName}
                        value={deviceName}
                        onSelect={setSelectedFirstDevice}
                      >
                        {deviceName}
                        <CheckIcon
                          className={cn(
                            "ml-auto h-4 w-4",
                            selectedFirstDevice === deviceName ? "opacity-100" : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <Label htmlFor="secondDevice" className="text-right">
            Second Device
          </Label>
          <Popover open={openSecondDeviceList} onOpenChange={setOpenSecondDeviceList}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openSecondDeviceList}
                className={cn(selectedSecondDevice ? "justify-between" : "justify-end")}
              >
                {selectedSecondDevice}
                <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0" id="secondDevice">
              <Command>
                <CommandList>
                  <CommandGroup>
                    {deviceNames.filter(name => name !== selectedFirstDevice).map((deviceName) => (
                      <CommandItem
                        id="deviceName"
                        key={deviceName}
                        value={deviceName}
                        onSelect={setSelectedSecondDevice}
                      >
                        {deviceName}
                        <CheckIcon
                          className={cn(
                            "ml-auto h-4 w-4",
                            selectedSecondDevice === deviceName ? "opacity-100" : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
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
        </div>
        <div className="flex justify-end w-4/12">
          <Button onClick={handleCompare} disabled={!startDate || !endDate || new Date(startDate) > new Date(endDate)}
          >Compare</Button>
        </div>
        {showChart && <CompareConsumptionChart firstDeviceRecords={firstDeviceRecords} secondDeviceRecords={secondDeviceRecords} />}

      </div>
    </div>

  );
};