import React from "react";
import {Box, Button, Stack, TextField} from "@mui/material";

export default function Login(){
    return(
        <Box sx={{
            backgroundColor: 'background.default',
            display: 'flex',
            justifyContent: 'center'
        }}>
            <Box
                sx={{
                    mt: 8,
                    width: 400,
                    height: 200,
                    backgroundColor: 'background.paper',
                    border: 3,
                    borderColor: 'black',
                    borderRadius: 6,
                    p: 5
                }}
            >
                <Stack spacing={3}>
                    <TextField fullWidth required label="Email" variant="outlined"/>
                    <TextField fullWidth required label="Password" variant="outlined"/>
                    <Button fullWidth size="large" color="secondary" variant="contained">login</Button>
                </Stack>
            </Box>
        </Box>
    );
}