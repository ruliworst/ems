import { injectable, inject } from "tsyringe";
import "@/config/container";
import { CreateTaskDTO, TaskDTO, TaskType, TaskViewDTO, UpdateTaskDTO } from "@/src/infrastructure/api/dtos/tasks/task.dto";
import GenerateAnomaliesReportTaskService from "./GenerateAnomaliesReportTaskService";
import { GenerateAnomaliesReportTaskEntity } from "@/src/infrastructure/entities/tasks/GenerateAnomaliesReportTaskEntity";
import { GenerateConsumptionReportTaskEntity } from "@/src/infrastructure/entities/tasks/GenerateConsumptionReportTaskEntity";
import { MaintenanceDeviceTaskEntity } from "@/src/infrastructure/entities/tasks/MaintenanceDeviceTaskEntity";
import { MonitorizeConsumptionTaskEntity } from "@/src/infrastructure/entities/tasks/MonitorizeConsumptionTaskEntity";
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

  async update(updateTaskDTO: UpdateTaskDTO): Promise<TaskDTO> {
    let updateTask;
    try {
      if (updateTaskDTO.type === TaskType.GENERATE_ANOMALIES_REPORT) {
        updateTask = await this.anomaliesReportTaskService.update(updateTaskDTO);
      } else if (updateTaskDTO.type === TaskType.GENERATE_CONSUMPTION_REPORT) {
        updateTask = await this.consumptionReportTaskService.update(updateTaskDTO);
      } else if (updateTaskDTO.type === TaskType.MAINTENANCE_DEVICE) {
        updateTask = await this.maintenanceDeviceTaskService.update(updateTaskDTO);
      } else if (updateTaskDTO.type === TaskType.MONITORIZE_CONSUMPTION) {
        updateTask = await this.monitorizeConsumptionTaskService.update(updateTaskDTO);
      } else {
        throw new Error("The specified task type is not valid.")
      }
      return updateTask.getTaskDTO();
    } catch (error) {
      console.error("Error updating a task:", error);
      throw error;
    }
  }

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

  async getTaskByPublicId(publicId: string): Promise<TaskDTO | null> {
    const tasks = await Promise.all([
      this.anomaliesReportTaskService.getTaskByPublicId(publicId),
      this.consumptionReportTaskService.getTaskByPublicId(publicId),
      this.maintenanceDeviceTaskService.getTaskByPublicId(publicId),
      this.monitorizeConsumptionTaskService.getTaskByPublicId(publicId),
    ]);

    const task = tasks.find(task => task !== null);
    return task ? task.getTaskDTO() : null;
  }
}

export default BaseTaskService;