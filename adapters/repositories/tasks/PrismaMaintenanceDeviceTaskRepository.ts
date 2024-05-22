import { MaintenanceDeviceTaskRepository } from "@/ports/tasks/MaintenanceDeviceTaskRepository";
import { PrismaClient, MaintenanceDeviceTask } from "@prisma/client";
import { injectable } from "tsyringe";

@injectable()
export default class PrismaMaintenanceDeviceTaskRepository implements MaintenanceDeviceTaskRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async getAll(): Promise<MaintenanceDeviceTask[]> {
    try {
      await this.connect();
      return this.prisma.maintenanceDeviceTask.findMany();
    } finally {
      this.disconnect();
    }
  }

  async connect(): Promise<void> {
    await this.prisma.$connect();
  }

  async disconnect(): Promise<void> {
    await this.prisma.$disconnect();
  }
}