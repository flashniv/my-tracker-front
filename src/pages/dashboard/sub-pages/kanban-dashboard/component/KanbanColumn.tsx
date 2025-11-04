import { Box, CircularProgress, Paper, Stack, Typography } from "@mui/material";
import { Task } from "../../../../../type/Task";
import KanbanTask from "./KanbanTask";

interface KanbanColumnProps {
    title: string,
    loading: boolean,
    tasks: Task[]
}

export default function KanbanColumn(props: KanbanColumnProps) {
    return (
        <Paper
            sx={{ width: "100%", bgcolor: "lightgray", p: 1 }}
        >
            <Box display={"flex"} justifyContent={"flex-end"}>
                {props.loading?<CircularProgress color="darkgrey" />:<></>}
                <Typography variant="h6" gutterBottom textAlign={"center"} p={1} width={"80%"} color="#747474">
                    {props.title}
                </Typography>
            </Box>
            <Stack spacing={1}>
                {props.tasks.map(task => <KanbanTask key={task.id} task={task} />)}
            </Stack>
        </Paper>
    );
}