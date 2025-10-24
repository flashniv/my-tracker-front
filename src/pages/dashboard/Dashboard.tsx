import { useState } from 'react';
import AppToolBar from './component/AppToolBar';
import SideBar from './component/SideBar';
import { Box } from '@mui/material';
import Client from './sub-pages/clients/Clients';
import Clients from './sub-pages/clients/Clients';

export default function Dashboard() {
    const [openSideBar, setOpenSideBar] = useState(false);
    const [title, setTitle] = useState("Dashboard");
    const [activePage, setActivePage] = useState(1);

    return (
        <>
            <AppToolBar title={title} clickOpenSideBar={() => { setOpenSideBar(true) }} />
            <SideBar openSideBar={openSideBar} setOpenSideBar={setOpenSideBar} />
            <Box>
                {activePage==1?<Clients />:<></>}
            </Box>
        </>
    );
}
