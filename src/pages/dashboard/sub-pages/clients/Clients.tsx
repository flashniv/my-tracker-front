import { Box, Button, CircularProgress, Container, Paper, Stack } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import { useContext, useEffect, useState } from "react";
import API from "../../../../common/API";
import { NotificationContext } from "../../../../common/NotificationContext";
import ClientAddDialog from "./component/ClientAddDialog";
import { useNavigate } from "react-router-dom";
import { Client } from "../../../../type/Client";

interface ClientProps {
    client: Client
}

function ClientItem(props: ClientProps) {
    const navigate = useNavigate();
    return (
        <Paper elevation={3} sx={{ display: "flex", justifyContent: "space-between", p: 2, cursor: "pointer" }}>
            <Box display={"flex"} alignItems={"center"}>
                {props.client.name}
            </Box>
            <Box>
                <Button onClick={() => navigate("/dashboard/project/" + (props.client.id != null ? props.client.id : -1))} variant="contained">Projects</Button>
                <Button onClick={() => navigate("/dashboard/accounting-period/" + (props.client.id != null ? props.client.id : -1))} variant="contained" sx={{ ml: 1 }}>Accounting periods</Button>
            </Box>
        </Paper>
    );
}

interface ClientsProps {
    setTitle: (title: string) => void
}

export default function Clients(props: ClientsProps) {
    const [clients, setClients] = useState<Client[]>([]);
    const [openAddDialog, setOpenAddDialog] = useState<boolean>(false);
    const notificationContext = useContext(NotificationContext);
    const [placeHolder, setPlaceHolder] = useState<boolean>(true);

    props.setTitle("Clients");

    function updateClients() {
        setPlaceHolder(true);
        API.getContent<Client[]>("/client")
            .then((persistClients) => {
                setClients(persistClients.data);
                setPlaceHolder(false);
            })
            .catch((error) => {
                notificationContext(error.message);
                setPlaceHolder(false);
            });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(updateClients, []);

    return (
        <Box sx={{ pt: 5 }}>
            <Container maxWidth="lg">
                <Stack spacing={2}>
                    {placeHolder ? <Box display={"flex"} justifyContent={"center"} sx={{ pt: 5 }}>
                        <CircularProgress color="primary" size="3rem" />
                    </Box>
                        : <>
                            <Paper elevation={3} sx={{ p: 2, textAlign: "center", bgcolor: "lightblue", cursor: "pointer" }} onClick={() => setOpenAddDialog(true)} ><AddIcon fontSize="medium" /></Paper>
                            {clients.map((client) =>
                                <ClientItem key={client.id} client={client} />
                            )}

                        </>}
                </Stack>
            </Container>
            <ClientAddDialog openDialog={openAddDialog} setOpenDialog={setOpenAddDialog} updateClients={updateClients} />
        </Box>
    )
}