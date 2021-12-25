import React, {useState} from "react";
import {Box, Button, Stack, TextField} from "@mui/material";

export default function Login(){
    const [login,setLogin]=useState("");
    const [password,setPassword]=useState("");

    const onLogin = function () {
        console.log(`login: ${login} pass: ${password}`)
    };

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
                    backgroundColor: 'background.default',
                    p: 5
                }}
            >
                <Stack spacing={3}>
                    <TextField fullWidth required value={login} onChange={(e)=>{setLogin(e.target.value);}} label="Email" variant="outlined"/>
                    <TextField fullWidth required value={password} onChange={(e) => {setPassword(e.target.value);}} label="Password" type="password" variant="outlined"/>
                    <Button fullWidth onClick={onLogin} size="large" color="secondary" variant="contained">login</Button>
                </Stack>
            </Box>
        </Box>
    );
}