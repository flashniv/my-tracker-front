import React from "react";
import {Alert, Button, IconButton, Menu, MenuItem, TableCell, TableRow} from "@mui/material";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import APIServer from "../../../API/APIServer";
import {useNavigate} from "react-router-dom";

export default function OrganizationItem({setAlert,updateOrgs,row}) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    let navigate=useNavigate()
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const onError = function (err) {
        setAlert(<Alert severity="error">Server return {err.response.status}!</Alert>)
    }

    const onDelete = () => {
        if(window.confirm("Delete it?")){
            const response = APIServer.postContent("/api/organization/delete/",row)
            response.then(()=>{
                updateOrgs()
                setAlert(<Alert severity="success">Organization was deleted!</Alert>)
            },onError)
        }
        handleClose()
    }
    return(
        <TableRow
            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
        >
            <TableCell
                sx={{
                    minWidth:'600px',
                    fontSize:'large'
                }}
            >{row.organizationName}</TableCell>
            <TableCell><Button variant="text" onClick={()=>navigate("/projects/"+row.id,{replace:true})}>Projects</Button></TableCell>
            <TableCell><Button variant="text">Reports</Button></TableCell>
            <TableCell><Button variant="text">Payments</Button></TableCell>
            <TableCell>
                <IconButton
                    color="primary"
                    aria-label="upload picture"
                    component="span"
                    id="basic-button"
                    aria-controls={open ? 'basic-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    onClick={handleClick}
                >
                    <MoreVertIcon />
                </IconButton>
                <Menu
                    id={"basic-menu"}
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    MenuListProps={{
                        'aria-labelledby': 'basic-button',
                    }}
                >
                    <MenuItem onClick={onDelete}>Delete</MenuItem>
                </Menu>
            </TableCell>
        </TableRow>
    );
}