import { createContext, useState } from 'react';
import AppToolBar from './component/AppToolBar';
import SideBar from './component/SideBar';
import { Box } from '@mui/material';

export default function Dashboard() {
    const [openSideBar, setOpenSideBar] = useState(false);

    return (
        <>
            <AppToolBar title='News1' clickOpenSideBar={() => { setOpenSideBar(true) }} />
            <SideBar openSideBar={openSideBar} setOpenSideBar={setOpenSideBar} />
            <Box>
                tyt
            </Box>
        </>
    );
}
