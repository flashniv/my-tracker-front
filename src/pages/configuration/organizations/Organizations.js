import React, {useEffect, useState} from "react";
import {Box, Button, Fab, Modal, Paper, Table, TableBody, TableContainer, TextField, Typography} from "@mui/material";
import APIServer from "../../../API/APIServer";
import AddIcon from '@mui/icons-material/Add';
import OrganizationItem from "../../../components/configuration/organizations/OrganizationItem";

const onError = function (err) {
    console.error(err)
}

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

export default function Organizations() {
    const [orgs, setOrgs] = useState([])
    const [openAddDialog, setOpenAddDialog] = useState(false)
    const [orgName,setOrgName] = useState("")

    const updateOrgs = function () {
        const response = APIServer.getContent("/api/organization/")
        response.then((value) => {
            setOrgs(value.data)
        }, onError)
    }

    const addOrg = function () {
        const org={
            "id": null,
            "organizationName": orgName,
            "owner": null
        }
        const response = APIServer.postContent("/api/organization/",org)
        response.then(()=>{
            updateOrgs()
            setOpenAddDialog(false)
        },onError)
    }

    useEffect(() => {
        updateOrgs()
    }, [])

    return (
        <>
            <Fab
                sx={{
                    position: 'fixed',
                    bottom: '30px',
                    right: '30px'
                }}
                color="primary"
                onClick={() => setOpenAddDialog(true)}
            >
                <AddIcon/>
            </Fab>
            {orgs.length !== 0
                ? <TableContainer component={Paper}>
                    <Table sx={{minWidth: 650}} aria-label="simple table">
                        <TableBody>
                            {orgs.map((row) => (
                                <OrganizationItem updateOrgs={updateOrgs} row={row} key={row.id}/>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                : <>You can add organization now</>
            }
            <Modal
                open={openAddDialog}
                onClose={() => setOpenAddDialog(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box style={style}>
                    <Typography id="modal-modal-title" align="center" variant="h6" component="h2">
                        Add organization
                    </Typography>
                    <TextField fullWidth required value={orgName} onChange={(event)=>setOrgName(event.target.value)} label="Organization name" variant="outlined"/>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'row-reverse',
                            p: 1
                        }}
                    >
                        <Button onClick={addOrg}>Add</Button>
                    </Box>
                </Box>
            </Modal>
        </>
    );
}