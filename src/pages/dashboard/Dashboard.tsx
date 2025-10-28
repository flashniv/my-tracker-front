import { useState } from 'react';
import AppToolBar from './component/AppToolBar';
import SideBar from './component/SideBar';
import { Alert, Box, Button, Container, Stack } from '@mui/material';
import Clients from './sub-pages/clients/Clients';
import { NotificationContext } from '../../common/NotificationContext';
import { useLocation, useNavigate } from 'react-router-dom';
import Projects from './sub-pages/projects/Projects';
import Tasks from './sub-pages/tasks/Tasks';

interface DashboardPageProps {
    setTitle: (title: string) => void
}

function DashboardPage(props: DashboardPageProps) {
    const navigate=useNavigate();

    return (
        <Container maxWidth="sm" sx={{pt:4}}>
            <Stack spacing={2}>
                <Button variant="text" onClick={()=>{navigate("/dashboard/client")}}>Clients</Button>
                <Button variant="text">Kanban Dashboard</Button>
            </Stack>
        </Container>
    );
}

export default function Dashboard() {
    const [openSideBar, setOpenSideBar] = useState(false);
    const [title, setTitle] = useState("Dashboard");
    const location = useLocation();
    const [alert, setAlert] = useState(<></>);

    function showAlert(alertMessage: string) {
        setAlert(<Alert severity='error' sx={{ position: "absolute", top: "80px", left: "15px", width: "400px" }} >{alertMessage}</Alert>)
    }

    return (
        <NotificationContext.Provider value={showAlert}>
            <AppToolBar title={title} clickOpenSideBar={() => { setOpenSideBar(true) }} />
            <SideBar openSideBar={openSideBar} setOpenSideBar={setOpenSideBar} />
            <Box>
                {location.pathname === '/dashboard' ? <DashboardPage setTitle={setTitle} /> : <></>}
                {location.pathname === '/dashboard/client' ? <Clients setTitle={setTitle} /> : <></>}
                {location.pathname.startsWith('/dashboard/project') ? <Projects setTitle={setTitle} /> : <></>}
                {location.pathname.startsWith('/dashboard/task') ? <Tasks setTitle={setTitle} /> : <></>}
            </Box>
            {alert}
        </NotificationContext.Provider>
    );
}
