import { Project } from "../Project";
import { Task } from "../Task";

export interface MonthReportDTO {
    project: Project,
    tasks: Task[],
    time: number
}