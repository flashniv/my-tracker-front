import {
    AppBar,
    Button,
    Collapse,
    Drawer,
    IconButton,
    List,
    ListItemButton,
    ListItemText,
    Toolbar,
    Typography
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import APIServer from "../../API/APIServer";
import {ExpandLess, ExpandMore} from "@mui/icons-material";
import HomeIcon from '@mui/icons-material/Home';
import SettingsIcon from '@mui/icons-material/Settings';
import CorporateFareIcon from '@mui/icons-material/CorporateFare';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function NavBar({login, title, setLogin}) {
    const [showSidebar, setShowSidebar] = useState(false)
    const [showConfig, setShowConfig] = useState(false)
    const navigate = useNavigate()

    const logout = function () {
        if (login) {
            setLogin(false)
            APIServer.setLoggedOut()
            navigate("/", {replace: false})
        } else {
            navigate("/login", {replace: false})
        }
    }
    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        onClick={() => setShowSidebar(true)}
                    >
                        <MenuIcon/>
                    </IconButton>
                    {window.location.pathname.localeCompare("/") !== 0
                        ? <>
                            <IconButton
                                onClick={() => {
                                    navigate("/", {replace: false});
                                }}
                                sx={{
                                    color: "white",
                                }}
                            >
                                <HomeIcon/>
                            </IconButton>
                            <IconButton
                                onClick={() => {
                                    navigate(-1)
                                }}
                                sx={{
                                    color: "white",
                                }}
                            >
                                <ArrowBackIcon/>
                            </IconButton>
                        </>
                        : <></>}
                    <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                        {title}
                    </Typography>
                    <Button onClick={logout} color="inherit">{login ? "Logout" : "Login"}</Button>
                    {!login
                        ?
                        <Button onClick={() => navigate("/register", {replace: false})} color="inherit">Register</Button>
                        : <></>
                    }
                </Toolbar>
            </AppBar>
            {login
                ? <Drawer
                    anchor="left"
                    open={showSidebar}
                    onClose={() => setShowSidebar(false)}
                >
                    <List
                        sx={{width: '100%', maxWidth: 360, bgcolor: 'background.paper'}}
                        component="nav"
                    >
                        <ListItemButton onClick={() => {
                            navigate("/", {replace: false});
                            setShowSidebar(false);
                        }}>
                            <HomeIcon/>
                            <ListItemText primary="Home"/>
                        </ListItemButton>
                        <ListItemButton onClick={() => {
                            navigate("/Dashboard", {replace: false});
                            setShowSidebar(false);
                        }}>
                            <DashboardIcon/>
                            <ListItemText primary="Dashboard"/>
                        </ListItemButton>
                        <ListItemButton onClick={() => {
                            navigate("/organizations", {replace: false});
                            setShowSidebar(false);
                        }}>
                            <CorporateFareIcon/>
                            <ListItemText primary="Organizations"/>
                        </ListItemButton>
                        <ListItemButton onClick={() => setShowConfig(!showConfig)}>
                            <SettingsIcon/>
                            <ListItemText primary="Configuration"/>
                            {showConfig ? <ExpandLess/> : <ExpandMore/>}
                        </ListItemButton>
                        <Collapse in={showConfig} timeout="auto" unmountOnExit>
                        </Collapse>
                    </List>
                </Drawer>
                : <></>
            }
        </>
    );
}