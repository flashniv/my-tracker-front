import React, {useState} from "react";
import {Box} from "@mui/material";
import DashboardTaskPlayer from "./DashboardTaskPlayer";
import ViewTaskDialog from "../../components/ViewTaskDialog/ViewTaskDialog";

export default function DashboardTask({task, updateTasks}) {
    const [openViewDialog, setOpenViewDialog] = useState(false)
    return (
        <>
            <Box
                sx={{
                    textAlign: "left",
                    mb: 1,
                    p: 1,
                    backgroundColor: "white"
                }}
                // onClick={()=>setOpenViewDialog(true)}
            >
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        textTransform: "uppercase",
                        mb: 1
                    }}
                >
                    <Box
                        sx={{
                            verticalAlign: "center"
                        }}
                    >
                        {task.project.organization.organizationName}
                    </Box>
                    <DashboardTaskPlayer row={task} updateTasks={updateTasks}/>
                </Box>
                {task.title}
            </Box>
            {openViewDialog
                ? <ViewTaskDialog task={task} updateTasks={updateTasks} openViewDialog={openViewDialog}
                                  setOpenViewDialog={setOpenViewDialog}/>
                : <></>
            }
        </>
    )
}