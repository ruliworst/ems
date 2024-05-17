import { DeviceRepository } from "@/ports/DeviceRepository";
import { PrismaClient, Device } from "@prisma/client";
import { injectable } from "tsyringe";

@injectable()
export default class PrismaDeviceRepository implements DeviceRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async getAll(): Promise<Device[]> {
    try {
      await this.connect();
      return this.prisma.device.findMany();
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