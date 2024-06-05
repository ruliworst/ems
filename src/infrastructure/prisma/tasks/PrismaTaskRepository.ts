import { inject } from "tsyringe";
import "@/config/container";
import type { DeviceRepository } from "@/src/domain/persistence/devices/DeviceRepository";
import { Operator, PrismaClient, Supervisor } from "@prisma/client";
import PrismaRepository from "../PrismaRepository";
import { TaskRepository } from "@/src/domain/persistence/tasks/TaskRepository";

export default abstract class PrismaTaskRepository<T> extends PrismaRepository implements TaskRepository<T> {
  constructor(
    @inject(PrismaClient) prismaClient: PrismaClient,
    @inject("DeviceRepository") private deviceRepository: DeviceRepository,
    protected entity: any,
  ) {
    super(prismaClient);
  }

  async getAll(): Promise<T[]> {
    try {
      await this.connect();
      return this.entity.findMany();
    } finally {
      this.disconnect();
    }
  }

  async create(task: Partial<T>, operatorEmail: string, deviceName: string): Promise<T> {
    try {
      const { operator, supervisor } = await this.getOperatorAndSupervisor(operatorEmail!);
      const device = await this.getDevice(deviceName);

      await this.connect();
      return await this.entity.create({
        data: {
          ...task,
          deviceId: device.id,
          operatorId: operator ? operator.id : null,
          supervisorId: supervisor ? supervisor.id : null,
        }
      });
    } finally {
      this.disconnect();
    }
  }

  async delete(publicId: string): Promise<T | null> {
    try {
      await this.connect();
      return await this.entity.delete({ where: { publicId } });
    } catch (error) {
      return null;
    } finally {
      this.disconnect();
    }
  }

  async update(publicId: string, updatedTask: Partial<T>): Promise<T | null> {
    try {
      await this.connect();
      const task = await this.entity.update({
        where: { publicId },
        data: { ...updatedTask },
      }).catch((error: any) => {
        console.error(error);
        return null;
      });

      return task;
    } finally {
      this.disconnect();
    }
  }

  async getTaskByPublicId(publicId: string): Promise<T | null> {
    try {
      await this.connect();
      const task = await this.entity.findUnique({
        where: {
          publicId,
        },
      });
      return task;
    } catch (error) {
      return null;
    } finally {
      this.disconnect();
    }
  }

  async getOperatorAndSupervisor(operatorEmail: string): Promise<{ operator: Operator | null, supervisor: Supervisor | null }> {
    const operator: Operator | null = await this.prismaClient.operator.findUnique({ where: { email: operatorEmail } });
    const supervisor: Supervisor | null = await this.prismaClient.supervisor.findUnique({ where: { email: operatorEmail } });
    if (!operator && !supervisor) {
      throw new Error(`Due to the operator or supervisor with email: ${operatorEmail} was not found, the task cannot be created.`);
    }
    return { operator, supervisor };
  }

  async getDevice(deviceName: string): Promise<any> {
    const device = await this.deviceRepository.getByName(deviceName);
    if (!device) {
      throw new Error(`Due to the device with name: ${deviceName} was not found, the task cannot be created.`);
    }
    return device;
  }
}
