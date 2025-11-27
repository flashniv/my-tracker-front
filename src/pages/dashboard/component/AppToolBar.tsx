import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { Box } from '@mui/material';
import { useContext } from 'react';
import { LoginContext } from '../../../common/LoginContext';
import API from '../../../common/API';
import { useNavigate } from 'react-router-dom';

interface AppToolBarProps {
    clickOpenSideBar: () => void,
    title: string
}

export default function AppToolBar(props: AppToolBarProps) {
    const loginContext = useContext(LoginContext);
    const navigate = useNavigate();

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                        onClick={props.clickOpenSideBar}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        {props.title}
                    </Typography>
                    {loginContext.isLoggedIn ?
                        <Button color="inherit" onClick={() => { API.logout(); loginContext.setLoggedIn(false); navigate("/login"); }} >
                            Logout
                        </Button>
                        : <Button color="inherit" onClick={(e) => { navigate("/login"); }}>Login</Button>
                    }
                </Toolbar>
            </AppBar>
        </Box>
    );
}
