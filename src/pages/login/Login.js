import React, {useState} from "react";
import {Box, Button, Stack, TextField} from "@mui/material";
import {useNavigate} from "react-router-dom";
import APIServer from "../../API/APIServer";

export default function Login({setLogin}) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate=useNavigate()

    const onError = function (err) {
        console.error(err)
    }

    const onLogin = function () {
        localStorage.setItem('userLogin',email)
        localStorage.setItem('userPassword',password)
        const response=APIServer.getContent("/api/account/")
        response.then((value)=>{
            setLogin(true)
            navigate("/",{replace:true})
        },onError)
    };

    return (
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
                <Button fullWidth onClick={onLogin} size="large" color="secondary" variant="contained">login</Button>
            </Stack>
        </Box>
    );
}