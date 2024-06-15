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
import { DeviceDTO, UpdateDeviceDTO } from "@/src/infrastructure/api/dtos/devices/device.dto";
import { DeviceApiService } from "@/src/infrastructure/api/services/devices/DeviceApiService";
import { AlertType, AlertViewDTO } from "@/src/infrastructure/api/dtos/alerts/alert.dto";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AlertApiService } from "@/src/infrastructure/api/services/alerts/AlertApiService";
import MonitorizeConsumptionChart from "./MonitorizeConsumptionChart";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider, Controller } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "./ui/form";

const updateDeviceFormSchema = z.object({
  name: z.string()
    .min(2, { message: "The name must contain at least 2 characters." })
    .max(50)
    .optional(),
  installationDate: z.date().optional(),
  ratedPower: z.number()
    .min(1, { message: "The device must have at least 1 kWh of rated power." })
    .optional(),
  observations: z.string().optional(),
});

export default function DeviceView({ device, fetchedAlerts }: { device: DeviceDTO, fetchedAlerts: AlertViewDTO[] }) {
  const { toast } = useToast();

  const formMethods = useForm({
    resolver: zodResolver(updateDeviceFormSchema),
    mode: "onChange",
    defaultValues: {
      name: device.name,
      installationDate: new Date(device.installationDate),
      ratedPower: device.ratedPower,
      observations: device.observations ?? ""
    },
  });

  const router = useRouter();
  const [installationDate, setInstallationDate] = useState<Date | undefined>(new Date(device.installationDate));
  const [lastMaintenanceDate, setLastMaintenanceDate] = useState<Date | undefined>();
  const [currentPower, setCurrentPower] = useState(device.currentPower);
  const [isEditing, setIsEditing] = useState(false);
  const [alerts, setAlerts] = useState<AlertViewDTO[]>(fetchedAlerts);
  const [showChart, setShowChart] = useState(false);

  useEffect(() => {
    if (device.installationDate) {
      setInstallationDate(new Date(device.installationDate));
    }

    if (device.lastMaintenance) {
      setLastMaintenanceDate(new Date(device.lastMaintenance));
    }
  }, [device]);

  const onSubmit = async (values: any) => {
    const updateDeviceDTO: UpdateDeviceDTO = { ...values, originalName: device.name };

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
          setInstallationDate(new Date(updatedDevice.installationDate));
          setCurrentPower(updatedDevice.currentPower);
          setIsEditing(false);
        }
      });
  };

  const handleDelete = async (name: string) => {
    try {
      await DeviceApiService.delete(name).then(device => {
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

  const getTypeAsString = (type: AlertType): string => {
    if (type == AlertType.MAINTENANCE) {
      return "Maintenance alert";
    } else if (type == AlertType.UNUSUAL_CONSUMPTION) {
      return "Unusual consumption alert";
    } else {
      return "Not valid type";
    };
  }

  const handleResolveAlert = async (publicId: string) => {
    try {
      await AlertApiService.resolve(device.name, publicId).then(resolvedAlert => {
        toast({
          title: "The alert was resolved.",
          description: `${new Date().toLocaleString()}`
        });
        setAlerts(prevAlerts => prevAlerts.map(alert =>
          alert.publicId === publicId ? resolvedAlert : alert
        ));
      });
    } catch (error: any) {
      console.error(`Error resolving alert: ${error.message}`);
    }
  }

  const handleDeleteAlert = async (publicId: string) => {
    try {
      await AlertApiService.delete(device.name, publicId).then(alert => {
        toast({
          title: "Alert deleted successfully",
          description: `${new Date().toLocaleString()}`
        });
        setAlerts(prevAlerts => prevAlerts.filter(alert => alert.publicId !== publicId));
      });
    } catch (error: any) {
      console.error(`Error deleting alert: ${error.message}`);
    }
  }

  return (
    <>
      <div className="p-6 h-screen">
        <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
          <FormProvider {...formMethods}>
            <form id="updateTaskForm" onSubmit={formMethods.handleSubmit(onSubmit)}>
              <div className="flex justify-between items-center mb-6">
                {isEditing ? (
                  <div className="w-1/2">
                    <FormField
                      control={formMethods.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel></FormLabel>
                          <FormControl>
                            <Input {...field} className="text-xl font-bold bg-white" value={formMethods.watch("name")} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
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

                  <Button variant="outline" type="button" onClick={() => setShowChart(!showChart)}>
                    <i className="fa-solid fa-chart-line"></i>
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-12">
                <div className={cn(isEditing ? "grid grid-cols-1 items-center gap-4" : "grid grid-cols-2 items-center gap-4")}>
                  {isEditing ? (
                    <FormField
                      control={formMethods.control}
                      name="installationDate"
                      render={({ field }) => (
                        <FormItem className="col-span-2 grid grid-cols-2 items-center gap-4">
                          <FormLabel className="text-right">Installation date</FormLabel>
                          <FormControl>
                            <Controller
                              name="installationDate"
                              control={formMethods.control}
                              render={({ field }) => (
                                <Popover>
                                  <PopoverTrigger asChild className="flex justify-start">
                                    <Button
                                      type="button"
                                      variant="outline"
                                      className="m-0 flex items-center"
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
                        </FormItem>
                      )}
                    />

                  ) : (
                    <>
                      <Label htmlFor="installationDate" className="text-right">Installation date</Label>
                      <Input id="installationDate" value={installationDate?.toDateString()} readOnly />
                    </>
                  )}
                  <div className="col-span-2 grid grid-cols-2 items-center gap-4">
                    <Label htmlFor="lastMaintenanceDate" className="text-right">Last maintenance date</Label>
                    <Input id="lastMaintenanceDate" value={lastMaintenanceDate?.toDateString()} readOnly />
                  </div>
                </div>
                <div className="grid grid-cols-1 items-center gap-4">
                  <FormField
                    control={formMethods.control}
                    name="ratedPower"
                    render={({ field }) => (
                      <FormItem className="grid grid-cols-2 items-center gap-4">
                        <FormLabel className="text-right">Rated power (kWh)</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            required
                            className={cn("mr-2", isEditing ? "bg-white" : "")}
                            type="number"
                            min={1}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                            readOnly={!isEditing}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 items-center gap-4">
                    <Label htmlFor="currentPower" className="text-right">Current power (kWh)</Label>
                    <div className="flex items-center">
                      <Input
                        id="currentPower"
                        type="number"
                        value={currentPower}
                        readOnly
                      />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 items-center gap-4">
                  <Label htmlFor="status" className="text-right">Status</Label>
                  <p>{device.status}</p>
                </div>
                <div className="grid grid-cols-1 items-start gap-4 col-span-2">
                  <FormField
                    control={formMethods.control}
                    name="observations"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-right">Observations</FormLabel>
                        <FormControl>
                          <Textarea {...field} className={cn("w-full max-h-[100px]", isEditing ? "bg-white" : "")} />
                        </FormControl>
                        <FormMessage className="col-span-3" />
                      </FormItem>
                    )}
                  />
                </div>
                {isEditing && (
                  <div className="flex justify-center mt-6">
                    <Button form="updateTaskForm" type="submit" disabled={!formMethods.formState.isDirty || !formMethods.formState.isValid}>Save</Button>
                  </div>
                )}
              </div>
            </form>
          </FormProvider>
        </div>
        <div className="bg-gray-100 p-6 rounded-lg shadow-lg mt-4">
          <h2 className="text-xl font-bold">Alerts</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-3/12">Type</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Resolved</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {alerts.map(alert => (
                <TableRow key={alert.publicId}>
                  <TableCell>{getTypeAsString(alert.type)}</TableCell>
                  <TableCell>{alert.message}</TableCell>
                  <TableCell>{alert.priority}</TableCell>
                  <TableCell>{alert.resolved ? "Yes" : "No"}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <AlertDialog>
                        <AlertDialogTrigger>
                          <Button variant="secondary" className="hover:bg-gray-300 bg-white" disabled={alert.resolved}><i className="fa-solid fa-check text-md"></i></Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure to resolve the alert?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleResolveAlert(alert.publicId)}>Continue</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                      <AlertDialog>
                        <AlertDialogTrigger>
                          <Button variant="secondary" className="hover:bg-gray-300 bg-white"><i className="fa-solid fa-trash"></i></Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure to delete the alert?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteAlert(alert.publicId)}>Continue</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>

                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {showChart && <MonitorizeConsumptionChart deviceName={device.name} />}
      </div>
      <Toaster />
    </>
  );
};
