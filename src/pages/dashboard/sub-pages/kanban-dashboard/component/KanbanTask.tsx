import { Paper } from "@mui/material";
import { Task } from "../../../../../type/Task";

interface KanbanTaskProps {
    task: Task
}

export default function KanbanTask(props: KanbanTaskProps) {
    return (
        <Paper>
            {props.task.name}
        </Paper>
    );
}