import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { useContext, useState } from "react";
import { NotificationContext } from "../../../../../common/NotificationContext";
import API from "../../../../../common/API";

interface ProjectAddDialogProps {
    openDialog: boolean,
    setOpenDialog: (open: boolean) => void,
    updateProjects: () => void,
    clientId: number
}

export default function ProjectAddDialog(props: ProjectAddDialogProps) {
    const notificationContext = useContext(NotificationContext);
    const [name, setName] = useState<string>("");

    function saveProject(e: React.FormEvent) {
        e.preventDefault();
        const newProject: Project = {
            id: null,
            name: name,
            client: null
        }
        API.postContent<Client, string>("/client/" + props.clientId + "/createProject", newProject)
            .then(() => {
                props.updateProjects();
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
            <form onSubmit={saveProject}>
                <DialogTitle id="alert-dialog-title">
                    Add project
                </DialogTitle>
                <DialogContent>
                    <TextField id="outlined-basic" label="Project" variant="outlined" fullWidth sx={{ minWidth: "500px" }} value={name} onChange={(e) => setName(e.target.value)} />
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