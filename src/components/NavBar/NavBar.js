import {AppBar, Button, IconButton, Toolbar, Typography} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import React from "react";

export default function NavBar({login,setLogin}) {
    const logout=function () {
        if(login){
            setLogin(false)
        }
    }
    return (
        <AppBar position="static">
            <Toolbar>
                <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    sx={{mr: 2}}
                >
                    <MenuIcon/>
                </IconButton>
                <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                    My task tracker
                </Typography>
                <Button onClick={logout} color="inherit">{login?"Logout":"Login"}</Button>
            </Toolbar>
        </AppBar>
    );
}