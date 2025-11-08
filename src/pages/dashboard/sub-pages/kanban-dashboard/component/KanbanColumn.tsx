import { Box, CircularProgress, Paper, Stack, Typography } from "@mui/material";
import KanbanTask from "./KanbanTask";
import { KanbanTasksContext } from "./KanbanTaskContext";
import { useContext } from "react";
import { TaskStatus } from "../../../../../type/TaskStatus";
import { Task } from "../../../../../type/Task";

interface KanbanColumnProps {
    title: string,
    loading: boolean,
    taskStatus: TaskStatus
}

function sortFunc(a: Task, b: Task): number {
    const aTime=new Date(a.createdOn);
    const bTime=new Date(b.createdOn);
    
    return aTime.getTime() - bTime.getTime();
}

export default function KanbanColumn(props: KanbanColumnProps) {
    const kanbanTasksContext = useContext(KanbanTasksContext);

    return (
        <Paper
            sx={{ width: "100%", bgcolor: "lightgray", p: 1 }}
        >
            <Box display={"flex"} justifyContent={"flex-end"}>
                {props.loading ? <CircularProgress color="primary" /> : <></>}
                <Typography variant="h6" gutterBottom textAlign={"center"} p={1} width={"80%"} color="#747474">
                    {props.title}
                </Typography>
            </Box>
            <Stack spacing={1}>
                {kanbanTasksContext[0].filter((value => value.taskStatus === props.taskStatus)).sort(sortFunc).map(task => <KanbanTask key={task.id} task={task} />)}
            </Stack>
        </Paper>
    );
}