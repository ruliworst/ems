import "reflect-metadata";
import "@/config/container";
import { container } from "tsyringe";
import { NextResponse } from "next/server";
import BaseTaskService from "@/application/services/tasks/BaseTaskService";
import { TaskDTO } from "@/dtos/tasks/task.dto";

export async function GET() {
  const baseTaskService = container.resolve(BaseTaskService);
  try {
    const tasks: TaskDTO[] = await baseTaskService.getAll();
    return NextResponse.json(tasks, { status: 200 })
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json({ error: "Failed to fetch tasks." }, { status: 500 })
  }
}
