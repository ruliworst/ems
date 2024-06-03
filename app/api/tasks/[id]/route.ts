import "@/config/container";
import { NextRequest, NextResponse } from 'next/server';
import { container } from 'tsyringe';
import BaseTaskService from "@/src/domain/services/tasks/BaseTaskService";
import { TaskDTO } from "@/src/infrastructure/api/dtos/tasks/task.dto";

const taskService = container.resolve(BaseTaskService);

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    const task: TaskDTO | null = await taskService.getTaskByPublicId(id);
    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }
    return NextResponse.json(task, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch task' }, { status: 500 });
  }
}
