import { inject } from "tsyringe";
import "@/config/container";
import type { DeviceRepository } from "@/src/domain/persistence/devices/DeviceRepository";
import { Operator, PrismaClient, Supervisor } from "@prisma/client";

export default abstract class PrismaTaskRepository<T> {
  protected prisma: PrismaClient;

  constructor(
    @inject("DeviceRepository") private deviceRepository: DeviceRepository
  ) {
    this.prisma = new PrismaClient();
  }

  async connect(): Promise<void> {
    await this.prisma.$connect();
  }

  async disconnect(): Promise<void> {
    await this.prisma.$disconnect();
  }

  async getOperatorAndSupervisor(operatorEmail: string): Promise<{ operator: Operator | null, supervisor: Supervisor | null }> {
    const operator: Operator | null = await this.prisma.operator.findUnique({ where: { email: operatorEmail! } });
    const supervisor: Supervisor | null = await this.prisma.supervisor.findUnique({ where: { email: operatorEmail! } });
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
