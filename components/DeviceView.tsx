import * as React from "react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { DeviceDTO } from "@/dtos/devices/device.dto";
import { Status } from "@prisma/client";
import { DeviceApiService } from "@/adapters/services/devices/DeviceApiService";
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
} from "@/components/ui/alert-dialog"


export default function DeviceView({ device, onSave }: { device: DeviceDTO, onSave: Function }) {
  const { toast } = useToast()
  const router = useRouter();
  const [installationDate, setInstallationDate] = useState<Date | undefined>();
  const [lastMaintenanceDate, setLastMaintenanceDate] = useState<Date | undefined>();
  const [ratedPower, setRatedPower] = useState(device.ratedPower);
  const [currentPower, setCurrentPower] = useState(0);
  const [observations, setObservations] = useState(device.observations);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    calculateCurrentPower(device.ratedPower);

    if (device.installationDate) {
      setInstallationDate(new Date(device.installationDate));
    }

    if (device.lastMaintenance) {
      setLastMaintenanceDate(new Date(device.lastMaintenance));
    }
  }, []);

  const calculateCurrentPower = (ratedPower: Number) => {
    let factor = 0;

    if (device.status === Status.IDLE) {
      factor = 0.1;
    } else if (device.status === Status.RUNNING) {
      factor = 0.5;
    } else if (device.status === Status.PEAK) {
      factor = 1;
    }

    setCurrentPower(Number(ratedPower) * factor);
  }

  const handleSave = () => {
    const updatedDevice: DeviceDTO = {
      ...device,
      installationDate: installationDate ? installationDate.toISOString() : device.installationDate,
      lastMaintenance: lastMaintenanceDate ? lastMaintenanceDate.toISOString() : device.lastMaintenance,
      ratedPower,
      observations,
    };
    onSave(updatedDevice);
    setIsEditing(false);
  };


  const handleDelete = async (deviceName: string) => {
    try {
      await DeviceApiService
        .delete(deviceName)
        .then(device => {
          toast({
            title: `${device.name} deleted succesfully`,
            description: `${new Date().toLocaleString()}`
          });
          router.push('/devices');
        });
    } catch (error: any) {
      console.error(`Error deleting device: ${error.message}`);
    }
  }

  return (
    <>
      <div className="w-10/12 p-6">
        <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">{device.name}</h2>
            <div className="flex space-x-4">
              <Button variant="outline" onClick={() => setIsEditing(!isEditing)}>
                <i className="fa-solid fa-pen"></i>
              </Button>
              <AlertDialog>
                <AlertDialogTrigger>
                  <Button variant="outline">
                    <i className="fa-solid fa-trash"></i>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure to delete the device with name {device.name}?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the device
                      and remove the data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDelete(device.name)}>Continue</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <Button variant="outline">
                <i className="fa-solid fa-chart-line"></i>
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-12">
            <div className="grid grid-cols-2 items-center gap-4">
              <Label htmlFor="installationDate" className="text-right">Installation date</Label>
              {isEditing ? (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn("justify-start text-left font-normal", !installationDate && "text-muted-foreground")}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {installationDate ? format(installationDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" id="installationDate">
                    <Calendar
                      mode="single"
                      selected={installationDate}
                      onSelect={setInstallationDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              ) : (
                <Input id="installationDate" value={installationDate?.toDateString()} readOnly />
              )}
              <Label htmlFor="lastMaintenanceDate" className="text-right">Last maintenance date</Label>
              {isEditing ? (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn("justify-start text-left font-normal", !lastMaintenanceDate && "text-muted-foreground")}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {lastMaintenanceDate ? format(lastMaintenanceDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" id="lastMaintenanceDate">
                    <Calendar
                      mode="single"
                      selected={lastMaintenanceDate}
                      onSelect={setLastMaintenanceDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              ) : (
                <Input id="lastMaintenanceDate" value={lastMaintenanceDate?.toDateString()} readOnly />
              )}
            </div>
            <div className="grid grid-cols-2 items-center gap-4">
              <Label htmlFor="ratedPower" className="text-right">Rated power</Label>
              <div className="flex items-center">
                <Input
                  id="ratedPower"
                  type="number"
                  value={ratedPower}
                  onChange={(e) => isEditing && setRatedPower(Number(e.target.value))}
                  className="mr-2"
                  readOnly={!isEditing}
                />
                <span>kWh</span>
              </div>
              <Label htmlFor="currentPower" className="text-right">Current power</Label>
              <div className="flex items-center">
                <Input
                  id="currentPower"
                  type="number"
                  value={currentPower}
                  onChange={(e) => isEditing && setCurrentPower(Number(e.target.value))}
                  className="mr-2"
                  readOnly={!isEditing}
                />
                <span>kWh</span>
              </div>
            </div>
            <div className="grid grid-cols-2 items-center gap-4">
              <Label htmlFor="status" className="text-right">Status</Label>
              <p>{device.status}</p>
            </div>
            <div className="grid grid-cols-1 items-start gap-4 col-span-2">
              <Label htmlFor="observations" className="text-left">Observations</Label>
              <Textarea
                id="observations"
                value={observations ? observations : ""}
                onChange={(e) => isEditing && setObservations(e.target.value)}
                className="w-full resize-none"
                readOnly={!isEditing}
              />
            </div>
            {isEditing && (
              <div className="flex justify-center mt-6">
                <Button onClick={handleSave}>Save</Button>
              </div>
            )}
          </div>

        </div>
        <div className="bg-gray-100 p-6 rounded-lg shadow-lg mt-4">
          <h2 className="text-xl font-bold">Alerts</h2>
        </div>
      </div>
      <Toaster />
    </>
  );
};
