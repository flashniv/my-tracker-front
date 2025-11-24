import { useState } from 'react';
import AppToolBar from './component/AppToolBar';
import SideBar from './component/SideBar';
import { Alert, Box, Snackbar, SnackbarCloseReason } from '@mui/material';
import Clients from './sub-pages/clients/Clients';
import { NotificationContext, NotificationContextMessage } from '../../common/NotificationContext';
import { useLocation } from 'react-router-dom';
import Projects from './sub-pages/projects/Projects';
import Tasks from './sub-pages/tasks/Tasks';
import AccountingPeriods from './sub-pages/accounting-period/AccountingPeriods';
import KanbanDashboard from './sub-pages/kanban-dashboard/KanbanDashboard';
import StatisticDashboard from './sub-pages/statistic-dasboard/StatisticDashboard';
import MonthReport from './sub-pages/report/month-report/MonthReport';

export default function Dashboard() {
    const [openSideBar, setOpenSideBar] = useState(false);
    const [title, setTitle] = useState("Dashboard");
    const location = useLocation();
    const [alert, setAlert] = useState<NotificationContextMessage>({ message: "", severity: "success", duration: 1000 });
    const [openAlert, setOpenAlert] = useState(false);

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenAlert(false);
    };

    function showAlert(alertMessage: NotificationContextMessage) {
        setAlert(alertMessage);
        setOpenAlert(true);
    }

    return (
        <NotificationContext.Provider value={showAlert}>
            <AppToolBar title={title} clickOpenSideBar={() => { setOpenSideBar(true) }} />
            <SideBar openSideBar={openSideBar} setOpenSideBar={setOpenSideBar} />
            <Box>
                {location.pathname === '/dashboard' ? <StatisticDashboard /> : <></>}
                {location.pathname === '/dashboard/client' ? <Clients setTitle={setTitle} /> : <></>}
                {location.pathname === '/dashboard/kanban-dashboard' ? <KanbanDashboard setTitle={setTitle} /> : <></>}
                {location.pathname === '/dashboard/report/month-report' ? <MonthReport setTitle={setTitle} /> : <></>}
                {location.pathname.startsWith('/dashboard/accounting-period') ? <AccountingPeriods setTitle={setTitle} /> : <></>}
                {location.pathname.startsWith('/dashboard/project') ? <Projects setTitle={setTitle} /> : <></>}
                {location.pathname.startsWith('/dashboard/task') ? <Tasks setTitle={setTitle} /> : <></>}
            </Box>
            <Snackbar open={openAlert} autoHideDuration={alert.duration} onClose={handleClose}>
                <Alert
                    onClose={handleClose}
                    severity={alert.severity}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {alert.message}
                </Alert>
            </Snackbar>
        </NotificationContext.Provider>
    );
}
