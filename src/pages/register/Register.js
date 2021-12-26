import React, {useState} from "react";
import {Box, Button, Stack, TextField} from "@mui/material";

export default function Register(){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const onRegister=function () {
        console.log("register")
    }

    return(
        <Box sx={{
            backgroundColor: 'background.default',
            display: 'flex',
            justifyContent: 'center'
        }}>
            <Stack
                sx={{
                    mt: 8,
                    width: 400,
                    height: 200,
                    backgroundColor: 'background.default',
                    p: 5
                }}
                spacing={3}>
                <TextField fullWidth required value={email} onChange={(e) => {
                    setEmail(e.target.value);
                }} label="Email" variant="outlined"/>
                <TextField fullWidth required value={password} onChange={(e) => {
                    setPassword(e.target.value);
                }} label="Password" type="password" variant="outlined"/>
                <Button fullWidth onClick={onRegister} size="large" color="secondary" variant="contained">register</Button>
            </Stack>
        </Box>
    );
}