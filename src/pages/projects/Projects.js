import React, {useState} from "react";
import {Fab} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import {useParams} from "react-router-dom";

export default function Projects() {
    const [alert,setAlert]=useState(<></>)
    const {orgId}=useParams()
    console.log(orgId)
    return (
        <>
            {alert}
            <Fab
                sx={{
                    position: 'fixed',
                    bottom: '30px',
                    right: '30px'
                }}
                color="primary"
                onClick={() => console.log("add")}
            >
                <AddIcon/>
            </Fab>
        </>
    );
}