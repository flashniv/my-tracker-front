import React, {useState} from "react";
import {Box, Button, Stack, TextField} from "@mui/material";
import APIServer from "../../API/APIServer";
import {useNavigate} from "react-router-dom";

export default function Register({setLogin}){
    const [email, setEmail] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [password,setPassword] = useState("");
    const navigate=useNavigate()

    const onError = function (err) {
        console.error(err)
    }

    const onRegister=function () {
        const user={
            login:email,
            firstName:firstName,
            lastName:lastName,
            passwordHash:password
        }
        const response=APIServer.postUnauthContent("/api/account/", user)
        response.then((value)=>{
            localStorage.setItem('userLogin',email)
            localStorage.setItem('userPassword',password)
            setLogin(true)
            navigate("/",{replace:true})
        },onError)
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
                <TextField fullWidth required value={firstName} onChange={(e) => {
                    setFirstName(e.target.value);
                }} label="First name" variant="outlined"/>
                <TextField fullWidth required value={lastName} onChange={(e) => {
                    setLastName(e.target.value);
                }} label="Last name" variant="outlined"/>
                <TextField fullWidth required value={password} onChange={(e) => {
                    setPassword(e.target.value);
                }} label="Password" type="password" variant="outlined"/>
                <Button fullWidth onClick={onRegister} size="large" color="secondary" variant="contained">register</Button>
            </Stack>
        </Box>
    );
}