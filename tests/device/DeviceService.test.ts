import 'reflect-metadata';
import { container } from 'tsyringe';
import prisma from '../../jest.setup';
import DeviceRepository from '@/services/repository/DeviceRepository';
import DeviceService from '@/services/DeviceService';
import { Prisma } from '@prisma/client';

describe('DeviceService', () => {
  let deviceService: DeviceService;

  beforeAll(() => {
    container.registerSingleton(DeviceRepository);
    deviceService = container.resolve(DeviceService);
  });

  afterAll(async () => {
    await deviceService.disconnect();
  });

  it('should fetch all devices', async () => {
    // Arrange.
    const deviceData: Prisma.DeviceCreateInput[] = [
      { name: 'Device 1', ratedPower: 100, installationDate: new Date() },
      { name: 'Device 2', ratedPower: 200, installationDate: new Date() },
    ];

    await prisma.device.createMany({ data: deviceData });

    // Act.
    const devices = await deviceService.getAllDevices();

    // Assert.
    expect(devices).toContain(deviceData[0])
    expect(devices).toContain(deviceData[1])
  });
});
