import "reflect-metadata";
import "@/config/container";
import { container } from "tsyringe";
import { NextRequest, NextResponse } from "next/server";
import BaseTaskService from "@/src/domain/services/tasks/BaseTaskService";
import { CreateTaskDTO, TaskViewDTO } from "@/src/infrastructure/api/dtos/tasks/task.dto";

export async function GET() {
  const baseTaskService = container.resolve(BaseTaskService);
  try {
    const tasks: TaskViewDTO[] = await baseTaskService.getAll();
    return NextResponse.json(tasks, { status: 200 })
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json({ error: "Failed to fetch tasks." }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const taskService = container.resolve(BaseTaskService);
  try {
    const data: CreateTaskDTO = await req.json();
    const task = await taskService.create(data);
    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create task.' }, { status: 500 });
  }
}
