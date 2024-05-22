import { injectable, inject } from "tsyringe";
import "@/config/container";
import { GenerateAnomaliesReportTaskDTO, GenerateConsumptionReportTaskDTO, MaintenanceDeviceTaskDTO, MonitorizeConsumptionTaskDTO, TaskDTO } from "@/dtos/tasks/task.dto";
import GenerateAnomaliesReportTaskService from "./GenerateAnomaliesReportTaskService";
import GenerateConsumptionReportTaskService from "./GenerateConsumptionReportTaskService";
import MaintenanceDeviceTaskService from "./MaintenanceDeviceTaskService";
import MonitorizeConsumptionTaskService from "./MonitorizeConsumptionTaskService";

@injectable()
class BaseTaskService {
  constructor(
    @inject(GenerateAnomaliesReportTaskService) private anomaliesReportTaskService: GenerateAnomaliesReportTaskService,
    @inject(GenerateConsumptionReportTaskService) private consumptionReportTaskService: GenerateConsumptionReportTaskService,
    @inject(MaintenanceDeviceTaskService) private maintenanceDeviceTaskService: MaintenanceDeviceTaskService,
    @inject(MonitorizeConsumptionTaskService) private monitorizeConsumptionTaskService: MonitorizeConsumptionTaskService
  ) { }

  async getAll(): Promise<TaskDTO[]> {
    const anomaliesReportTasks = await this.anomaliesReportTaskService.getAll();
    const consumptionReportTasks = await this.consumptionReportTaskService.getAll();
    const maintenanceDeviceTasks = await this.maintenanceDeviceTaskService.getAll();
    const monitorizeConsumptionTasks = await this.monitorizeConsumptionTaskService.getAll();

    const tasks: TaskDTO[] = [];

    anomaliesReportTasks.map(
      (task: GenerateAnomaliesReportTaskDTO) => tasks.push(this.anomaliesReportTaskService.toTaskDTO(task)));
    consumptionReportTasks.map(
      (task: GenerateConsumptionReportTaskDTO) => tasks.push(this.consumptionReportTaskService.toTaskDTO(task)));
    maintenanceDeviceTasks.map(
      (task: MaintenanceDeviceTaskDTO) => tasks.push(this.maintenanceDeviceTaskService.toTaskDTO(task)));
    monitorizeConsumptionTasks.map(
      (task: MonitorizeConsumptionTaskDTO) => tasks.push(this.monitorizeConsumptionTaskService.toTaskDTO(task)));

    return tasks;
  };
}

export default BaseTaskService;