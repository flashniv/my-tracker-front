import { Box, Paper } from "@mui/material";
import { Task } from "../../../../../type/Task";

interface KanbanTaskProps {
    task: Task
}

export default function KanbanTask(props: KanbanTaskProps) {
    return (
        <Paper
            sx={{ p: 1 }}
        >
            <Box
                sx={{ textTransform: "uppercase" }}
            >
                {props.task.project?.client?.name} - {props.task.project?.name}
            </Box>
            <Box pt={1}>
                {props.task.name}
            </Box>
        </Paper>
    );
}