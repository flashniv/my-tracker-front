import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import InboxIcon from '@mui/icons-material/MoveToInbox';
import { JSX } from "react";

interface SideBarItemProps{
    text:string,
    icon:JSX.Element,
    onClick:()=>void
}

function SideBarItem(props:SideBarItemProps) {
    return (
        <ListItem key={props.text} disablePadding>
            <ListItemButton onClick={props.onClick}>
                <ListItemIcon>
                    {props.icon}
                </ListItemIcon>
                <ListItemText primary={props.text} />
            </ListItemButton>
        </ListItem>
    );
}

interface SideBarProps {
    openSideBar: boolean,
    setOpenSideBar: (open: boolean) => void
}

export default function SideBar(props: SideBarProps) {
    return (
        <Drawer open={props.openSideBar} onClose={() => props.setOpenSideBar(false)}>
            <List>
                <SideBarItem text="text" icon={<InboxIcon/>} onClick={()=>props.setOpenSideBar(false)}/>
            </List>
        </Drawer>
    );
}