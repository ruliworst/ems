"use client";

import "reflect-metadata";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { TaskType, TaskViewDTO } from "@/dtos/tasks/task.dto";
import { TaskApiService } from "@/adapters/services/tasks/TaskApiService";
import { v4 as uuidv4 } from "uuid";
import CreateTaskDialog from "@/components/CreateTaskDialog";

// TODO: Restyle the top layout.

// TODO: Use skeleton.
export default function TasksView() {
  const [tasks, setTasks] = useState<TaskViewDTO[]>([]);

  useEffect(() => {
    async function loadDevices() {
      try {
        const allTasks = await TaskApiService.fetchAll();
        setTasks(allTasks);
      } catch (err: any) {
        console.error(err.message);
      }
    }

    loadDevices();
  }, []);

  function getTypeAsString(type: TaskType): string {
    if (type == TaskType.GENERATE_ANOMALIES_REPORT) {
      return "Anomalies report";
    } else if (type == TaskType.GENERATE_CONSUMPTION_REPORT) {
      return "Consumption report";
    } else if (type == TaskType.MAINTENANCE_DEVICE) {
      return "Maintenance device";
    } else if (type == TaskType.MONITORIZE_CONSUMPTION) {
      return "Monitorize consumption";
    } else {
      return "Not valid type";
    };
  }

  const handleTaskCreated = (newTask: TaskViewDTO) => {
    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  return (
    <>
      <div className="bg-gray-100 p-6 w-10/12">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Tasks</h1>
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
          <CreateTaskDialog onTaskCreated={handleTaskCreated} />
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Start date</TableHead>
                <TableHead>End date</TableHead>
                <TableHead>Frequency</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.map(task => (
                // TODO: Remove the random uuid by a controlled value.
                <TableRow key={uuidv4()}>
                  <TableCell>{getTypeAsString(task.type)}</TableCell>
                  <TableCell>{task.startDate}</TableCell>
                  <TableCell>{task.endDate}</TableCell>
                  <TableCell>{task.frequency}</TableCell>
                  <TableCell>
                    <a href={`/tasks`}>
                      <Button variant="secondary" className="hover:bg-gray-300"><i className="fa-solid fa-eye text-md"></i></Button>
                    </a>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
};