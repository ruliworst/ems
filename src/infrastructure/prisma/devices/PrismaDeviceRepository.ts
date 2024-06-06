import "@/config/container";
import { DeviceRepository } from "@/src/domain/persistence/devices/DeviceRepository";
import { Device, Prisma, PrismaClient } from "@prisma/client";
import { inject, injectable } from "tsyringe";
import { UpdateDeviceDTO } from "../../api/dtos/devices/device.dto";
import PrismaRepository from "../PrismaRepository";

@injectable()
export default class PrismaDeviceRepository extends PrismaRepository implements DeviceRepository {
  constructor(
    @inject(PrismaClient) protected prismaClient: PrismaClient,
  ) {
    super(prismaClient);
  }

  async delete(name: string): Promise<Device | null> {
    try {
      await this.connect();
      return await this.prismaClient.device.delete({ where: { name } });
    } catch (error) {
      return null;
    } finally {
      this.disconnect();
    }
  }

  async getAll(): Promise<Device[]> {
    try {
      await this.connect();
      return this.prismaClient.device.findMany();
    } finally {
      this.disconnect();
    }
  }

  async getByName(name: string): Promise<Device | null> {
    try {
      await this.connect();
      return this.prismaClient.device.findUnique({ where: { name } });
    } finally {
      this.disconnect();
    }
  }

  async create(device: Prisma.DeviceCreateInput): Promise<Device> {
    try {
      await this.connect();
      return this.prismaClient.device.create({ data: device });
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
      const device = this.prismaClient.device.update({
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
    await this.prismaClient.$connect();
  }

  async disconnect(): Promise<void> {
    await this.prismaClient.$disconnect();
  }
}