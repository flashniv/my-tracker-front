import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { useContext, useState } from "react";
import API from "../../../../../common/API";
import { NotificationContext } from "../../../../../common/NotificationContext";
import { Client } from "../../../../../type/Client";

interface ClientAddDialogProps {
    openDialog: boolean,
    setOpenDialog: (open: boolean) => void,
    updateClients: () => void
}

export default function ClientAddDialog(props: ClientAddDialogProps) {
    const notificationContext = useContext(NotificationContext);
    const [name, setName] = useState<string>("");

    function saveClient(e: React.FormEvent) {
        e.preventDefault();
        const newClient: Client = {
            id: null,
            name: name
        }
        API.postContent<Client, string>("/client", newClient)
            .then(() => {
                props.updateClients();
                setName("");
                props.setOpenDialog(false);
            })
            .catch((error) => {
                notificationContext(error.message);
            });
    }

    return (
        <Dialog
            open={props.openDialog}
            onClose={() => props.setOpenDialog(false)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <form onSubmit={saveClient}>
                <DialogTitle id="alert-dialog-title">
                    Add client
                </DialogTitle>
                <DialogContent>
                    <TextField id="outlined-basic" label="Client" variant="outlined" fullWidth sx={{ minWidth: "500px" }} value={name} onChange={(e) => setName(e.target.value)} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => { setName(""); props.setOpenDialog(false); }}>Cancel</Button>
                    <Button autoFocus type="submit">
                        Save
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}