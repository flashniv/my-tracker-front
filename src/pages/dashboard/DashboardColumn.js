import React from "react";
import {Box} from "@mui/material";
import DashboardTask from "./DashboardTask";

export default function DashboardColumn({title,rows,updateTasks}) {

    return(
        <Box
            sx={{
                minWidth:"250px",
                textAlign:"center"
            }}
        >
            <h3>{title}</h3>
            {rows.map((task)=><DashboardTask task={task} key={task.id} updateTasks={updateTasks}/>)}
        </Box>
    )
}