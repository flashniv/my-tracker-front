import React, {useEffect, useState} from "react";
import {
    Alert, Backdrop,
    Box,
    Button, CircularProgress,
    Fab,
    Modal,
    Paper,
    Table,
    TableBody,
    TableContainer,
    TextField,
    Typography
} from "@mui/material";
import APIServer from "../../API/APIServer";
import AddIcon from '@mui/icons-material/Add';
import OrganizationItem from "../../components/configuration/organizations/OrganizationItem";

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
    const [alert,setAlert] = useState(<></>)
    const [orgs, setOrgs] = useState(undefined)
    const [openAddDialog, setOpenAddDialog] = useState(false)
    const [orgName,setOrgName] = useState("")

    const onError = function (err) {
        setAlert(<Alert severity="error">Server return {err.response.status}</Alert>)
    }

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
            setAlert(<Alert severity="success">Organization was added!</Alert>)
        },onError)
    }

    useEffect(() => {
        updateOrgs()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

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
                onClick={() => setOpenAddDialog(true)}
            >
                <AddIcon/>
            </Fab>
            { orgs === undefined
                ?<Backdrop
                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={true}
                >
                    <CircularProgress color="inherit" />
                </Backdrop>
                :<></>
            }
            { orgs!==undefined && orgs.length !== 0
                ? <TableContainer component={Paper}>
                    <Table sx={{minWidth: 650}} aria-label="simple table">
                        <TableBody>
                            {orgs.map((row) => (
                                <OrganizationItem setAlert={setAlert} updateOrgs={updateOrgs} row={row} key={row.id}/>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                : <></>
            }
            { orgs!==undefined && orgs.length === 0
                ? <Box>You can add organization with "+" button</Box>
                : <></>
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