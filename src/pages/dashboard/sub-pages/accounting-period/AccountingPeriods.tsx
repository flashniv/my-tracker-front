import { Box, Button, CircularProgress, Container, Grid, Paper, Stack, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { NotificationContext, NotificationContextMessage } from "../../../../common/NotificationContext";
import AddIcon from '@mui/icons-material/Add';
import API from "../../../../common/API";
import { AccountingPeriod } from "../../../../type/AccountingPeriod";

interface AccountingPeriodItemProps {
    AccountingPeriod: AccountingPeriod
}

function AccountingPeriodItem(props: AccountingPeriodItemProps) {
    const createdDate = new Date("" + props.AccountingPeriod.createdOn);
    const closedDate = props.AccountingPeriod.closedOn == null ? null : new Date("" + props.AccountingPeriod.closedOn);

    return (
        <Paper elevation={3} sx={{ p: 2, cursor: "pointer" }}>
            <Grid container spacing={2}>
                <Grid size={3}>
                    {props.AccountingPeriod.open ? <Typography fontWeight="bold">Opened</Typography> : <></>}
                </Grid>
                <Grid size={3} sx={{ display: "flex", direction: "row" }}>
                    {props.AccountingPeriod.sent ? <Typography>Sent</Typography> : <Button size="small" variant="contained">Send</Button>}
                    {props.AccountingPeriod.paid ? <Typography pl={2}>Paid</Typography> : <Button size="small" variant="contained" sx={{ ml: 2 }}>Pay</Button>}
                    {props.AccountingPeriod.open ? <Button size="small" variant="contained" sx={{ ml: 2 }}>Close</Button> : <></>}
                </Grid>
                <Grid size={3}>
                    <Typography>Started on: {createdDate.toLocaleString()}</Typography>
                </Grid>
                <Grid size={3}>
                    {closedDate ? <Typography>Closed on: {closedDate.toLocaleString()}</Typography> : <></>}
                </Grid>
            </Grid>
        </Paper>
    )
}

interface AccountingPeriodsProps {
    setTitle: (title: string) => void
}

export default function AccountingPeriods(props: AccountingPeriodsProps) {
    const params = useParams();
    const [AccountingPeriods, setAccountingPeriods] = useState<AccountingPeriod[]>([]);
    const notificationContext = useContext(NotificationContext);
    const [placeHolder, setPlaceHolder] = useState<boolean>(true);
    let id = -1;

    props.setTitle("AccountingPeriods");

    if (params.id !== undefined) {
        id = parseInt(params.id);
    }

    function sortPeriods(a: AccountingPeriod, b: AccountingPeriod) {
        if (a.createdOn != null && b.createdOn != null) {
            const aStartPeriod = new Date(a.createdOn);
            const bStartPeriod = new Date(b.createdOn);
            return bStartPeriod.getTime() - aStartPeriod.getTime();
        }
        return 0;
    }

    function startNewAccountingPeriod() {
        if (window.confirm("You are ready to start new accounting period?")) {
            API.postContent<void, string>("/client/" + id + "/createAccountingPeriods")
                .then((persistAccountingPeriods) => {
                    updateAccountingPeriods();
                    const alertMessage: NotificationContextMessage = {
                        message: "Done!",
                        severity: "success",
                        duration: 700
                    }
                    notificationContext(alertMessage);
                })
                .catch((error) => {
                    const alertMessage: NotificationContextMessage = {
                        message: error.message,
                        severity: "error",
                        duration: 5000
                    }
                    notificationContext(alertMessage);
                });
        }
    }

    function updateAccountingPeriods() {
        setPlaceHolder(true);
        API.getContent<AccountingPeriod[]>("/client/" + id + "/accountingPeriods")
            .then((persistAccountingPeriods) => {
                setAccountingPeriods(persistAccountingPeriods.data);
                setPlaceHolder(false);
            })
            .catch((error) => {
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
    useEffect(updateAccountingPeriods, []);

    return (
        <Box sx={{ pt: 5 }}>
            <Container maxWidth="lg">
                <Stack spacing={2}>
                    {placeHolder ? <Box display={"flex"} justifyContent={"center"} sx={{ pt: 5 }}>
                        <CircularProgress color="primary" size="3rem" />
                    </Box>
                        : <>
                            <Paper elevation={3} sx={{ p: 2, textAlign: "center", bgcolor: "lightblue", cursor: "pointer" }} onClick={startNewAccountingPeriod} ><AddIcon fontSize="medium" /></Paper>
                            {AccountingPeriods.sort(sortPeriods).map((AccountingPeriod) =>
                                <AccountingPeriodItem key={AccountingPeriod.id} AccountingPeriod={AccountingPeriod} />
                            )}
                        </>}
                </Stack>
            </Container>
        </Box>
    );
}