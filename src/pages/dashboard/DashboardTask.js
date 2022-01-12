import React from "react";
import {Box} from "@mui/material";
import DashboardTaskPlayer from "./DashboardTaskPlayer";

export default function DashboardTask({task,updateTasks}) {
    return(
        <Box
            sx={{
                textAlign:"left",
                mb:1,
                p:1,
                backgroundColor:"white"
            }}
        >
            <Box
                sx={{
                    display:"flex",
                    justifyContent:"space-between",
                    textTransform:"uppercase",
                    mb:1
                }}
            >
                <Box
                    sx={{
                        verticalAlign:"center"
                    }}
                >
                    {task.project.organization.organizationName}
                </Box>
                <DashboardTaskPlayer row={task} updateTasks={updateTasks}/>
            </Box>
            {task.title}
        </Box>
    )
}