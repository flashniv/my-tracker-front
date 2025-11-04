import { Paper, Stack, Typography } from "@mui/material";
import { Task } from "../../../../../type/Task";

interface KanbanColumnProps {
    title:string,
    tasks:Task[]
}

export default function KanbanColumn(props: KanbanColumnProps) {
    return (
        <Paper
            sx={{width:"100%",bgcolor:"lightgray"}}
        >
            <Typography variant="h6" gutterBottom textAlign={"center"} p={2} color="#747474">{props.title}</Typography>
            <Stack>
                
            </Stack>
        </Paper>
    );
}