import { ProjectDTO } from "./ProjectDTO";

export interface ClientDTO {
    id: number,
    name: string,
    createdOn: Date,
    projects: ProjectDTO[]
}
