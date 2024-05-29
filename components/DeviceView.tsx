import * as React from "react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { DeviceDTO, UpdateDeviceDTO } from "@/dtos/devices/device.dto";
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

export default function DeviceView({ device }: { device: DeviceDTO }) {
  const { toast } = useToast()
  const router = useRouter();
  const [installationDate, setInstallationDate] = useState<Date | undefined>(new Date(device.installationDate));
  const [lastMaintenanceDate, setLastMaintenanceDate] = useState<Date | undefined>();
  const [ratedPower, setRatedPower] = useState(device.ratedPower);
  const [currentPower, setCurrentPower] = useState(device.currentPower);
  const [observations, setObservations] = useState(device.observations);
  const [deviceName, setDeviceName] = useState(device.name);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setDeviceName(device.name);

    if (device.installationDate) {
      setInstallationDate(new Date(device.installationDate));
    }

    if (device.lastMaintenance) {
      setLastMaintenanceDate(new Date(device.lastMaintenance));
    }
  }, [device]);

  const handleUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const updateDeviceDTO: UpdateDeviceDTO = {
      originalName: device.name,
      name: device.name !== deviceName ? deviceName : null,
      installationDate: device.installationDate !== installationDate?.toDateString()
        ? (installationDate?.toISOString() ?? null)
        : null,
      ratedPower: device.ratedPower !== ratedPower ? ratedPower : null,
      observations: device.observations !== observations ? (observations ?? null) : null,
    };

    await DeviceApiService.patch(updateDeviceDTO)
      .then((updatedDevice) => {
        const description = `${new Date().toLocaleString()}`;

        if (updatedDevice.name !== device.name) {
          toast({
            title: `${updatedDevice.name} has been updated. The page has been reloaded because the route has changed.`,
            description
          });
          router.push(`/devices/${updatedDevice.name}`);
        } else {
          toast({
            title: `${device.name} updated.`,
            description
          });
          setDeviceName(updatedDevice.name);
          setInstallationDate(new Date(updatedDevice.installationDate));
          setRatedPower(updatedDevice.ratedPower);
          setObservations(updatedDevice.observations);
          setCurrentPower(updatedDevice.currentPower);
          setIsEditing(false);
        }
      });
  }

  const handleDelete = async (deviceName: string) => {
    try {
      await DeviceApiService.delete(deviceName).then(device => {
        toast({
          title: `${device.name} deleted successfully`,
          description: `${new Date().toLocaleString()}`
        });
        router.push('/devices');
      });
    } catch (error: any) {
      console.error(`Error deleting device: ${error.message}`);
    }
  }

  const checkChanges = (): boolean => {
    return deviceName != device.name ||
      installationDate?.toDateString() != device.installationDate ||
      ratedPower != device.ratedPower ||
      observations != device.observations;
  }

  return (
    <>
      <div className="w-10/12 p-6">
        <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
          <form id="updateTaskForm" onSubmit={handleUpdate}>
            <div className="flex justify-between items-center mb-6">
              {isEditing ? (
                <div className="w-1/2">
                  <Label htmlFor="deviceName"></Label>
                  <Input
                    id="deviceName"
                    value={deviceName}
                    className="text-xl font-bold bg-white"
                    onChange={(e) => setDeviceName(e.target.value)}
                  />
                </div>
              ) : (
                <h2 className="text-xl font-bold">{device.name}</h2>
              )}
              <div className="flex space-x-4">
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

                <Button variant="outline" type="button">
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
                        type="button"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {installationDate ? installationDate.toDateString() : <span>Pick a date</span>}
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
                <Input id="lastMaintenanceDate" value={lastMaintenanceDate?.toDateString()} readOnly />
              </div>
              <div className="grid grid-cols-2 items-center gap-4">
                <Label htmlFor="ratedPower" className="text-right">Rated power</Label>
                <div className="flex items-center">
                  <Input
                    id="ratedPower"
                    type="number"
                    value={ratedPower}
                    onChange={(e) => setRatedPower(Number(e.target.value))}
                    className={cn("mr-2", isEditing ? "bg-white" : "")}
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
                    className="mr-2"
                    readOnly
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
                  value={observations || ""}
                  onChange={(e) => setObservations(e.target.value)}
                  className={cn("w-full resize-none", isEditing ? "bg-white" : "")}
                  readOnly={!isEditing}
                />
              </div>
              {isEditing && checkChanges() && (
                <div className="flex justify-center mt-6">
                  <Button form="updateTaskForm" type="submit">Save</Button>
                </div>
              )}
            </div>
          </form>
        </div>
        <div className="bg-gray-100 p-6 rounded-lg shadow-lg mt-4">
          <h2 className="text-xl font-bold">Alerts</h2>
        </div>
      </div>
      <Toaster />
    </>
  );
};
