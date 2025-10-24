import { useState } from 'react';
import AppToolBar from './component/AppToolBar';
import SideBar from './component/SideBar';
import { Alert, Box } from '@mui/material';
import Clients from './sub-pages/clients/Clients';
import { NotificationContext } from '../../common/NotificationContext';
import { useLocation } from 'react-router-dom';

export default function Dashboard() {
    const [openSideBar, setOpenSideBar] = useState(false);
    const [title, setTitle] = useState("Dashboard");
    const location = useLocation();
    const [alert, setAlert] = useState(<></>);

    console.log(location);

    function showAlert(alertMessage: string) {
        setAlert(<Alert severity='error' sx={{ position: "absolute", top: "80px", left: "15px", width: "400px" }} >{alertMessage}</Alert>)
    }

    return (
        <NotificationContext.Provider value={showAlert}>
            <AppToolBar title={title} clickOpenSideBar={() => { setOpenSideBar(true) }} />
            <SideBar openSideBar={openSideBar} setOpenSideBar={setOpenSideBar} />
            <Box>
                {location.pathname=='/dashboard/client'?<Clients />:<></>}
            </Box>
            {alert}
        </NotificationContext.Provider>
    );
}
