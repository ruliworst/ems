import { PrismaClient, Device } from '@prisma/client';
import { injectable } from 'tsyringe';

@injectable()
class DeviceRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async getAll(): Promise<Device[]> {
    return this.prisma.device.findMany();
  }

  async disconnect(): Promise<void> {
    await this.prisma.$disconnect();
  }
}

export default DeviceRepository;
