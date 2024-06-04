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

export async function PATCH(req: NextRequest) {
  try {
    const updateTaskDTO = await req.json();
    const updatedTask: TaskDTO | null = await taskService.update(updateTaskDTO);

    if (!updatedTask) {
      return NextResponse.json({ error: 'Task not found or update failed' }, { status: 404 });
    }

    return NextResponse.json(updatedTask, { status: 200 });
  } catch (error) {
    console.error("Error updating task:", error);
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    const task: TaskDTO | null = await taskService.delete(id);
    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }
    return NextResponse.json(task, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to task device' }, { status: 500 });
  }
}