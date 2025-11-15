import { Client } from "./Client";

export interface Project {
    id: number | null,
    name: string,
    client: Client | null
}
