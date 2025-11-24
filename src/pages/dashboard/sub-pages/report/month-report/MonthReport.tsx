import { Fragment, JSX, useContext, useEffect, useState } from "react";
import { NotificationContext, NotificationContextMessage } from "../../../../../common/NotificationContext";
import { Box, CircularProgress, Container, Grid, TextField } from "@mui/material";
import API from "../../../../../common/API";
import { MonthReportDTO } from "../../../../../type/DTO/MonthReportDTO";
import { Client } from "../../../../../type/Client";

function sortData(a: MonthReportDTO, b: MonthReportDTO): number {
    const aName = a.project.client?.name;
    const bName = b.project.client?.name;
    if (aName !== undefined && bName !== undefined) {
        return aName.localeCompare(bName);
    }
    return 0;
}

function getProjects(client: Client, dtos: MonthReportDTO[]): JSX.Element[] {
    let projects: JSX.Element[] = [];
    let totalTime = 0;

    function getTime(oldTime: number): string {
        totalTime += oldTime;
        return (oldTime / 3600).toFixed(2);
    }

    dtos.forEach(dto => {
        if (dto.project.client?.id !== undefined && dto.project.client?.id === client.id) {
            projects.push(
                <Fragment key={dto.project.id}>
                    <Grid
                        size={10}
                        p={1}
                        borderBottom={"1px solid #e7e7e7ff"}
                    >
                        {dto.project.name}
                    </Grid>
                    <Grid
                        size={2}
                        p={1}
                        borderBottom={"1px solid #e7e7e7ff"}
                    >
                        {getTime(dto.time)}
                    </Grid>
                </Fragment>
            );
        }
    });
    projects.push(
        <Fragment key={"total_" + client.id}>
            <Grid
                size={10}
                p={1}
                fontWeight={"bold"}
                textAlign={"right"}
            >
                Total
            </Grid>
            <Grid
                size={2}
                p={1}
            >
                {(totalTime / 3600).toFixed(2)}
            </Grid>
        </Fragment>
    );
    return projects;
}

function getSummaryTable(dtos: MonthReportDTO[]) {
    let clients: Client[] = [];

    dtos.forEach(element => {
        if (element.project.client !== null) {
            let found = false;
            clients.forEach(client => {
                if (!found && client.id === element.project.client?.id) {
                    found = true;
                }
            });
            if (!found) {
                clients.push(element.project.client);
            }
        }
    });
    return (
        <>
            {clients.map(client =>
                <Fragment key={client.id}>
                    <Grid
                        size={12}
                        display={"flex"}
                        justifyContent={"center"}
                        fontWeight={"bold"}
                        p={2}
                        mt={2}
                        borderBottom={"1px solid grey"}
                    >
                        {client.name}
                    </Grid>
                    {getProjects(client, dtos)}
                </Fragment>
            )}
        </>
    );
}

function getCSV(dtos: MonthReportDTO[]): string {
    let res = "";
    dtos.forEach(dto => {
        const prefix = dto.project.client?.name + ";" + dto.project.name + ";";
        dto.tasks.forEach(task => {
            res += prefix + task.name + "\n";
        });
    });
    return res;
}

interface MonthReportProps {
    setTitle: (title: string) => void
}

export default function MonthReport(props: MonthReportProps) {
    props.setTitle("Monthly report");
    const notificationContext = useContext(NotificationContext);
    const [placeHolder, setPlaceHolder] = useState<boolean>(true);
    const [data, setData] = useState<MonthReportDTO[]>([]);

    function updateReport() {
        setPlaceHolder(true);
        API.getContent<MonthReportDTO[]>("/report/monthReport")
            .then(data => {
                setData(data.data.sort(sortData));
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
    useEffect(updateReport, []);

    return (
        <Container maxWidth="sm" sx={{ p: 2 }}>
            {placeHolder ?
                <Box display={"flex"} justifyContent={"center"}><CircularProgress size="3rem" /></Box>
                : <Grid container>{getSummaryTable(data)}</Grid>
            }
            <TextField
                label="CSV"
                fullWidth
                multiline
                rows={10}
                value={getCSV(data)}
            />
        </Container>
    );
}