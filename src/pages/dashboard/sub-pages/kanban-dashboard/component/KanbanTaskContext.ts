import { createContext } from "react";
import { Task } from "../../../../../type/Task";

export const KanbanTasksContext = createContext<[Task[],()=>void]>([[],() => { }]);
