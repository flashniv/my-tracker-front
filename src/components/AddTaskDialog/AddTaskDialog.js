import React, {useEffect, useState} from "react";
import {
    Box,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Modal,
    Select,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import APIServer from "../../API/APIServer";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    // height: 400,
    backgroundColor: '#fff',
    border: '2px solid #000',
    boxShadow: 24,
    padding: '20px',
};

export default function AddTaskDialog({updateTasks, openAddDialog, setOpenAddDialog}) {
    const [newTitle, setNewTitle] = useState("")
    const [newDesc, setNewDesc] = useState("")

    const [orgs, setOrgs] = useState()
    const [currentOrg, setCurrentOrg] = useState("")
    const [projects, setProjects] = useState()
    const [currentProj, setCurrentProj] = useState("")

    const addTask = function () {
        const proj = {
            "id": currentProj,
            "organization": null,
            "projectName": null
        }
        const task = {
            "project": proj,
            "id": null,
            "title": newTitle,
            "description": newDesc,
        }
        const response = APIServer.postContent("/api/task/", task)
        response.then(() => {
            updateTasks()
            setNewTitle("")
            setNewDesc("")
            setOpenAddDialog(false)
            //setAlert(<Alert severity="success">Task was added!</Alert>) //TODO add reaction
        }, onError)
    }

    const loadProjects=function (orgId) {
        setCurrentOrg(orgId)
        const response = APIServer.getContent("/api/organization/"+orgId+"/projects");
        response.then((value) => {
            setProjects(value.data)
        }, onError)
    }

    useEffect(() => {
        const response = APIServer.getContent("/api/organization/");
        response.then((value) => {
            setOrgs(value.data)
        }, onError)

    }, [])

    const onError = function (err) {
        //setAlert(<Alert severity="error">Server return {err.response.status}</Alert>)   //TODO release it
    }

    return (
        <Modal
            open={openAddDialog}
            onClose={() => setOpenAddDialog(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Stack style={style} spacing={2}>
                <Typography id="modal-modal-title" align="center" variant="h6" component="h2">
                    Add task
                </Typography>
                {orgs !== undefined
                    ? <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Organization</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={currentOrg}
                            label="Organization"
                            onChange={(event) => loadProjects(event.target.value)}
                        >
                            {orgs.map((org) => <MenuItem value={org.id} key={org.id}>{org.organizationName}</MenuItem>)}
                        </Select>
                    </FormControl>
                    : <></>
                }
                {projects !== undefined
                    ? <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label1">Project</InputLabel>
                        <Select
                            labelId="demo-simple-select-label1"
                            id="demo-simple-select1"
                            value={currentProj}
                            label="Project"
                            onChange={(event) => setCurrentProj(event.target.value)}
                        >
                            {projects.map((proj) => <MenuItem value={proj.id} key={proj.id}>{proj.projectName}</MenuItem>)}
                        </Select>
                    </FormControl>
                    : <></>
                }
                <TextField fullWidth required label="Title" value={newTitle}
                           onChange={(e) => setNewTitle(e.target.value)} variant="outlined"/>
                <TextField fullWidth label="Description" multiline rows={4} value={newDesc}
                           onChange={(e) => setNewDesc(e.target.value)}/>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row-reverse',
                        p: 1
                    }}
                >
                    <Button onClick={addTask}>Add</Button>
                </Box>
            </Stack>
        </Modal>
    )
}