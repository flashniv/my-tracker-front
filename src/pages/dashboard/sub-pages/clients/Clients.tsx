import styled from "@emotion/styled";
import { Box, Container, Paper, Stack } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import { useContext, useEffect, useState } from "react";
import { LoginContext } from "../../../../common/LoginContext";
import API from "../../../../common/API";
import { NotificationContext } from "../../../../common/NotificationContext";

interface ClientProps {
  client: Client,
  onClick: () => void
}

function ClientItem(props: ClientProps) {
  return (
    <Paper elevation={3} sx={{ p: 2, cursor: "pointer" }}>
      {props.client.name}
    </Paper>
  )
}

export default function Clients() {
  const [clients, setClients] = useState<Client[]>([]);
  const notificationContext = useContext(NotificationContext);

  useEffect(() => {
    API.getContent<Client[]>("/client")
      .then((persistClients) => {
        setClients(persistClients.data);
      })
      .catch((error)=>{
        notificationContext(error.message);
      });
  }, []);

  return (
    <Box sx={{ pt: 5 }}>
      <Container maxWidth="lg">
        <Stack spacing={2}>
          <Paper elevation={3} sx={{ p: 2, textAlign: "center", bgcolor: "lightblue", cursor: "pointer" }}><AddIcon fontSize="medium" /></Paper>
          {clients.map((client) =>
            <ClientItem key={client.id} client={client} onClick={() => { }} />
          )}
        </Stack>
      </Container>
    </Box>

  )
}