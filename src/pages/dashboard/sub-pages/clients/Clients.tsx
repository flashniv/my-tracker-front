import { Box, Container, Paper, Stack } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import { useContext, useEffect, useState } from "react";
import API from "../../../../common/API";
import { NotificationContext } from "../../../../common/NotificationContext";
import ClientAddDialog from "./component/ClientAddDialog";
import { useNavigate } from "react-router-dom";

interface ClientProps {
    client: Client,
    onClick: () => void
}

function ClientItem(props: ClientProps) {
    return (
        <Paper elevation={3} sx={{ p: 2, cursor: "pointer" }} onClick={props.onClick}>
            {props.client.name}
        </Paper>
    );
}

interface ClientsProps{
    setTitle:(title:string)=>void
}

export default function Clients(props:ClientsProps) {
    const [clients, setClients] = useState<Client[]>([]);
    const [openAddDialog, setOpenAddDialog] = useState<boolean>(false);
    const notificationContext = useContext(NotificationContext);
    const navigate = useNavigate();

    props.setTitle("Clients");

    function updateClients() {
        API.getContent<Client[]>("/client")
            .then((persistClients) => {
                setClients(persistClients.data);
            })
            .catch((error) => {
                notificationContext(error.message);
            });
    }

    function clickToItem(clientId: number) {
        navigate("/dashboard/project/" + clientId);
    }

    useEffect(updateClients, []);

    return (
        <Box sx={{ pt: 5 }}>
            <Container maxWidth="lg">
                <Stack spacing={2}>
                    <Paper elevation={3} sx={{ p: 2, textAlign: "center", bgcolor: "lightblue", cursor: "pointer" }} onClick={() => setOpenAddDialog(true)} ><AddIcon fontSize="medium" /></Paper>
                    {clients.map((client) =>
                        <ClientItem key={client.id} client={client} onClick={() => clickToItem(client.id!=null?client.id:-1)} />
                    )}
                </Stack>
            </Container>
            <ClientAddDialog openDialog={openAddDialog} setOpenDialog={setOpenAddDialog} updateClients={updateClients} />
        </Box>
    )
}