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

export default function NavBar({login,title, setLogin}) {
    const [showSidebar, setShowSidebar] = useState(false)
    const [showConfig, setShowConfig] = useState(false)
    const navigate = useNavigate()
    const logout = function () {
        if (login) {
            setLogin(false)
            APIServer.setLoggedOut()
            navigate("/", {replace: true})
        } else {
            navigate("/login", {replace: true})
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
                        sx={{mr: 2}}
                    >
                        <MenuIcon/>
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                        {title}
                    </Typography>
                    <Button onClick={logout} color="inherit">{login ? "Logout" : "Login"}</Button>
                    {!login
                        ? <Button onClick={()=>navigate("/register", {replace: true})} color="inherit">Register</Button>
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
                        <ListItemButton onClick={() => {navigate("/", {replace: true}); setShowSidebar(false);}}>
                            <HomeIcon/>
                            <ListItemText primary="Home"/>
                        </ListItemButton>
                        <ListItemButton onClick={() =>{navigate("/Dashboard", {replace: true}); setShowSidebar(false);}}>
                            <DashboardIcon/>
                            <ListItemText primary="Dashboard"/>
                        </ListItemButton>
                        <ListItemButton onClick={()=>{navigate("/organizations", {replace: true}); setShowSidebar(false);}}>
                            <CorporateFareIcon/>
                            <ListItemText primary="Organizations" />
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