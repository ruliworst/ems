import { injectable, inject } from 'tsyringe';
import { Device } from '@prisma/client';
import DeviceRepository from './repository/DeviceRepository';

@injectable()
class DeviceService {
  constructor(
    @inject(DeviceRepository) private deviceRepository: DeviceRepository
  ) { }

  async getAllDevices(): Promise<Device[]> {
    return this.deviceRepository.getAll();
  }

  async disconnect(): Promise<void> {
    await this.deviceRepository.disconnect();
  }
}

export default DeviceService;
