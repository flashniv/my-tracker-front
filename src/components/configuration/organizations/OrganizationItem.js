import React from "react";
import {Button, IconButton, Menu, MenuItem, TableCell, TableRow} from "@mui/material";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import APIServer from "../../../API/APIServer";

const onError = function (err) {
    console.error(err)
}

export default function OrganizationItem({updateOrgs,row}) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const onDelete = () => {
        if(window.confirm("Delete it?")){
            const response = APIServer.postContent("/api/organization/delete/",row)
            response.then(()=>{
                updateOrgs()
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
            <TableCell><Button variant="text">Projects</Button></TableCell>
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