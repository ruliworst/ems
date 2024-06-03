"use client";

import DeviceView from '@/components/DeviceView'
import TaskView from '@/components/TaskView';
import { DeviceDTO } from '@/src/infrastructure/api/dtos/devices/device.dto';
import { TaskDTO } from '@/src/infrastructure/api/dtos/tasks/task.dto';
import { DeviceApiService } from '@/src/infrastructure/api/services/devices/DeviceApiService';
import { TaskApiService } from '@/src/infrastructure/api/services/tasks/TaskApiService';
import { useEffect, useState } from 'react';

export default function TaskPage({ params }: { params: { id: string } }) {
  const id = params.id;
  const [task, setTask] = useState<TaskDTO>();

  useEffect(() => {
    async function getDevice() {
      try {
        const fetchedTask = await TaskApiService.fetchByPublicId(id!);
        setTask(fetchedTask);
      } catch (err: any) {
        console.error(err.message);
      }
    }

    getDevice();
  }, []);

  if (task) {
    return <TaskView task={task!} />
  }

  return <></>;
}