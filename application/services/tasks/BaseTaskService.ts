import { injectable, inject } from "tsyringe";
import "@/config/container";
import { CreateTaskDTO, TaskType, TaskViewDTO } from "@/dtos/tasks/task.dto";
import GenerateAnomaliesReportTaskService from "./GenerateAnomaliesReportTaskService";
import GenerateConsumptionReportTaskService from "./GenerateConsumptionReportTaskService";
import MaintenanceDeviceTaskService from "./MaintenanceDeviceTaskService";
import MonitorizeConsumptionTaskService from "./MonitorizeConsumptionTaskService";
import { GenerateAnomaliesReportTaskEntity } from "@/domain/model/GenerateAnomaliesReportTask";
import { GenerateConsumptionReportTaskEntity } from "@/domain/model/GenerateConsumptionReportTask";
import { MaintenanceDeviceTaskEntity } from "@/domain/model/MaintenanceDeviceTask";
import { MonitorizeConsumptionTaskEntity } from "@/domain/model/MonitorizeConsumptionTask";

@injectable()
class BaseTaskService {
  constructor(
    @inject(GenerateAnomaliesReportTaskService) private anomaliesReportTaskService: GenerateAnomaliesReportTaskService,
    @inject(GenerateConsumptionReportTaskService) private consumptionReportTaskService: GenerateConsumptionReportTaskService,
    @inject(MaintenanceDeviceTaskService) private maintenanceDeviceTaskService: MaintenanceDeviceTaskService,
    @inject(MonitorizeConsumptionTaskService) private monitorizeConsumptionTaskService: MonitorizeConsumptionTaskService
  ) { }

  async getAll(): Promise<TaskViewDTO[]> {
    const anomaliesReportTasks: GenerateAnomaliesReportTaskEntity[] = await this.anomaliesReportTaskService.getAll();
    const consumptionReportTasks: GenerateConsumptionReportTaskEntity[] = await this.consumptionReportTaskService.getAll();
    const maintenanceDeviceTasks: MaintenanceDeviceTaskEntity[] = await this.maintenanceDeviceTaskService.getAll();
    const monitorizeConsumptionTasks: MonitorizeConsumptionTaskEntity[] = await this.monitorizeConsumptionTaskService.getAll();

    const tasks: TaskViewDTO[] = [];

    anomaliesReportTasks.map((task: GenerateAnomaliesReportTaskEntity) => tasks.push(task.getTaskView()));
    consumptionReportTasks.map((task: GenerateConsumptionReportTaskEntity) => tasks.push(task.getTaskView()));
    maintenanceDeviceTasks.map((task: MaintenanceDeviceTaskEntity) => tasks.push(task.getTaskView()));
    monitorizeConsumptionTasks.map((task: MonitorizeConsumptionTaskEntity) => tasks.push(task.getTaskView()));

    return tasks;
  };

  async create(createTaskDTO: CreateTaskDTO): Promise<TaskViewDTO> {
    let createdTask;
    try {
      if (createTaskDTO.type === TaskType.GENERATE_ANOMALIES_REPORT) {
        createdTask = await this.anomaliesReportTaskService.create(createTaskDTO);
      } else if (createTaskDTO.type === TaskType.GENERATE_CONSUMPTION_REPORT) {
        createdTask = await this.consumptionReportTaskService.create(createTaskDTO);
      } else if (createTaskDTO.type === TaskType.MAINTENANCE_DEVICE) {
        createdTask = await this.maintenanceDeviceTaskService.create(createTaskDTO);
      } else if (createTaskDTO.type === TaskType.MONITORIZE_CONSUMPTION) {
        createdTask = await this.monitorizeConsumptionTaskService.create(createTaskDTO);
      } else {
        throw new Error("The specified task type is not valid.")
      }
      return createdTask.getTaskView();
    } catch (error) {
      console.error("Error creating a task:", error);
      throw error;
    }
  }
}

export default BaseTaskService;