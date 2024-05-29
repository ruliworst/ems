import { UpdateDeviceDTO } from "@/dtos/devices/device.dto";
import { DeviceRepository } from "@/ports/devices/DeviceRepository";
import { PrismaClient, Device, Prisma } from "@prisma/client";
import { injectable } from "tsyringe";

@injectable()
export default class PrismaDeviceRepository implements DeviceRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async delete(name: string): Promise<Device | null> {
    try {
      await this.connect();
      return await this.prisma.device.delete({ where: { name } });
    } catch (error) {
      return null;
    } finally {
      this.disconnect();
    }
  }

  async getAll(): Promise<Device[]> {
    try {
      await this.connect();
      return this.prisma.device.findMany();
    } finally {
      this.disconnect();
    }
  }

  async getByName(name: string): Promise<Device | null> {
    try {
      await this.connect();
      return this.prisma.device.findUnique({ where: { name } });
    } finally {
      this.disconnect();
    }
  }

  async create(device: Prisma.DeviceCreateInput): Promise<Device> {
    try {
      await this.connect();
      return this.prisma.device.create({ data: device });
    } finally {
      this.disconnect();
    }
  }

  async update(originalName: string, updateData: UpdateDeviceDTO): Promise<Device | null> {
    if (updateData.name === "") {
      throw new Error("It was not possible to update the Device because the name cannot be empty.");
    }

    const updatedDevice: Partial<Device> = {
      name: updateData.name ? updateData.name : undefined,
      ratedPower: updateData.ratedPower ? updateData.ratedPower : undefined,
      installationDate: updateData.installationDate ? new Date(updateData.installationDate) : undefined,
      observations: updateData.observations ? updateData.observations : undefined,
    }

    try {
      await this.connect();
      const device = this.prisma.device.update({
        where: { name: originalName },
        data: { ...updatedDevice },
      }).catch(error => {
        console.error(error);
        return null;
      });

      return device;
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