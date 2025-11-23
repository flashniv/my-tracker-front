import { Box, Button, Card, CardActions, CardContent, CircularProgress, Container, Grid, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../../../common/API";
import { DashboardStatisticDTO } from "../../../../type/DTO/DashboardStatisticDTO";
import { NotificationContext, NotificationContextMessage } from "../../../../common/NotificationContext";

export default function StatisticDashboard() {
    const navigate = useNavigate();
    const [placeHolder, setPlaceHolder] = useState<boolean>(true);
    const notificationContext = useContext(NotificationContext);
    const [todayTime, setTodayTime] = useState<string>("");
    const [weeklyTime, setWeeklyTime] = useState<string>("");

    function updateStatistic() {
        setPlaceHolder(true);
        API.getContent<DashboardStatisticDTO>("/dashboard")
            .then(data => {
                setTodayTime("" + ((data.data.todaySeconds)/3600).toFixed(2));
                setWeeklyTime("" + ((data.data.weekSeconds)/3600).toFixed(2));
                setPlaceHolder(false);
            })
            .catch(error => {
                const alertMessage: NotificationContextMessage = {
                    message: error.message,
                    severity: "error",
                    duration: 5000
                }
                notificationContext(alertMessage);
                setPlaceHolder(false);
            });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(updateStatistic, []);

    return (
        <Container maxWidth="md" sx={{ p: 4, mt: 4, bgcolor: "secondary.main" }} >
            <Grid container spacing={2}>
                <Grid size={6}>
                    <Card sx={{ minWidth: 275 }} variant="outlined">
                        <CardContent sx={{ minHeight: "90px" }}>
                            <Typography variant="h5" component="div">
                                Clients
                            </Typography>
                            <Typography variant="body2">
                                If you need to add client or
                                <br />
                                start new accounting period
                                <br />
                                go here
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button size="small" onClick={() => { navigate("/dashboard/client") }}>Clients</Button>
                        </CardActions>
                    </Card>
                </Grid>
                <Grid size={6}>
                    <Card sx={{ minWidth: 275 }} variant="outlined">
                        <CardContent sx={{ minHeight: "90px" }}>
                            <Typography variant="h5" component="div">
                                Kanban dashboard
                            </Typography>
                            <Typography variant="body2">
                                Or see all you task here
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button size="small" onClick={() => { navigate("/dashboard/kanban-dashboard") }}>Kanban Dashboard</Button>
                        </CardActions>
                    </Card>
                </Grid>
                <Grid size={6}>
                    <Card sx={{ minWidth: 275 }} variant="outlined">
                        <CardContent sx={{ minHeight: "90px" }}>
                            <Typography variant="h5" component="div">
                                Today hours
                            </Typography>
                            <Typography variant="body2">
                                hours which tracked today
                            </Typography>
                            {placeHolder ?
                                <Box display={"flex"} justifyContent={"flex-end"} minHeight={"57px"} alignItems={"center"}><CircularProgress sx={{ color: "text.secondary" }} /></Box>
                                : <Typography variant="h3" textAlign={"right"} color="textSecondary"  onClick={updateStatistic} sx={{cursor:"pointer"}}>
                                    {todayTime}
                                </Typography>}
                        </CardContent>
                    </Card>
                </Grid>
                <Grid size={6}>
                    <Card sx={{ minWidth: 275 }} variant="outlined">
                        <CardContent sx={{ minHeight: "90px" }}>
                            <Typography variant="h5" component="div">
                                Weekly hours
                            </Typography>
                            <Typography variant="body2">
                                hours which tracked current week
                            </Typography>
                            {placeHolder ?
                                <Box display={"flex"} justifyContent={"flex-end"} minHeight={"57px"} alignItems={"center"}><CircularProgress sx={{ color: "text.secondary" }} /></Box>
                                : <Typography variant="h3" textAlign={"right"} color="textSecondary" onClick={updateStatistic} sx={{cursor:"pointer"}}>
                                    {weeklyTime}
                                </Typography>}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    );
}