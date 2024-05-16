import 'reflect-metadata';
import { container } from 'tsyringe';
import prisma from '../../jest.setup';
import DeviceRepository from '@/services/repository/DeviceRepository';
import { Prisma } from '@prisma/client';

describe('DeviceRepository', () => {
  let deviceRepository: DeviceRepository;

  beforeAll(() => {
    deviceRepository = container.resolve(DeviceRepository);
  });

  afterAll(async () => {
    await deviceRepository.disconnect();
  });

  it('should fetch all devices', async () => {
    // Arrange.
    const deviceData: Prisma.DeviceCreateInput[] = [
      { name: 'Device 1', ratedPower: 100, installationDate: new Date() },
      { name: 'Device 2', ratedPower: 200, installationDate: new Date() },
    ];

    await prisma.device.createMany({ data: deviceData });

    // Act.
    const devices = await deviceRepository.getAll();

    // Assert.
    expect(devices).toContain(deviceData[0])
    expect(devices).toContain(deviceData[1])
  });
});
