import React from "react";
import {Button, TableCell, TableRow} from "@mui/material";

export default function OrganizationItem({row}) {

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
        </TableRow>
    );
}