import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Device } from "@prisma/client";

// TODO: Restyle the top layout.

// TODO: Implement the use of a service to get the devices from database. Use skeleton.
const devices: Device[] = [

]

export default function DevicesView() {
  return (
    <div className="bg-gray-100 p-6 w-10/12">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Devices</h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-black">Dereck Wilson</span>
            <div className="bg-gray-300 w-8 h-8 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
          </div>
        </div>
      </header>
      <div className="bg-white rounded-lg shadow p-6">
        <Button>
          <i className="fa-solid fa-plus pr-3"></i>
          Add device
        </Button>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-3/12">Name</TableHead>
              <TableHead>Rated power</TableHead>
              <TableHead>Installation date</TableHead>
              <TableHead>Last maintenance</TableHead>
              <TableHead>Status</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {devices.map((device) => (
              <TableRow key={device.id}>
                <TableCell>{device.name}</TableCell>
                <TableCell>{device.ratedPower}</TableCell>
                <TableCell>{device.installationDate.toDateString()}</TableCell>
                <TableCell>{device.lastMaintenance?.toDateString()}</TableCell>
                <TableCell>{device.status}</TableCell>
                <TableCell><i className="fa-solid fa-eye"></i></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};