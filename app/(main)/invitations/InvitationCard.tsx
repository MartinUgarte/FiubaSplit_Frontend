import * as React from "react";
import Image from "next/image";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/navigation";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import { Invitation } from "app/types";
import GroupAddIcon from '@mui/icons-material/GroupAdd';


type InvitationCardProps = {
    invitation: Invitation;
    getInvitations: () => void;
};

export default function InvitationCard({ invitation, getInvitations }: InvitationCardProps) {
    const router = useRouter();
    const [groupName, setGroupName] = useState("");
    const [inviterName, setInviterName] = useState("");

    useEffect(() => {
        getGroup();
        getUser();
    }, []);

    const getUser = () => {
        const jwt = localStorage.getItem("jwtToken");
        if (!jwt) {
            return;
        }
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${invitation.invited_by_id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwt}`,
            },
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Network response was not ok");
                }
                return res.json();
            })
            .then((data) => {
                console.log("Got user: ", data);
                setInviterName(data.name);
            });
    };

    const getGroup = () => {
        const jwt = localStorage.getItem("jwtToken");
        if (!jwt) {
            return;
        }
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/groups/${invitation.group_id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwt}`,
            },
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Network response was not ok");
                }
                return res.json();
            })
            .then((data) => {
                console.log("Got group: ", data);
                setGroupName(data.name);
            });
    };

    const acceptInvitation = () => {
        const jwt = localStorage.getItem("jwtToken");
        if (!jwt) {
            return;
        }
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/invitations/groups/${invitation.id}/accept`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwt}`,
            },
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Network response was not ok");
                }
                return res.json();
            })
            .then((data) => {
                console.log("Got DATA: ", data);
                window.location.reload();
            });
    };

    const rejectInvitation = () => {
        const jwt = localStorage.getItem("jwtToken");
        if (!jwt) {
            return;
        }
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/invitations/groups/${invitation.id}/reject`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwt}`,
            },
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Network response was not ok");
                }
                return res.json();
            })
            .then((data) => {
                console.log("Got DATA: ", data);
                window.location.reload();
            });
    };

    return (
        <Card style={{ borderTop: "2px solid #64a8e3", height: 100 }}>
            <Box flex='1' display='flex' flexDirection='row' height="100%">
                <Box flex='0.5' display='flex' flexDirection='row' justifyContent='flex-start' alignItems='center' sx={{ marginLeft: 5 }}>
                    <GroupAddIcon sx={{ fontSize: 40 }} />
                    <Typography gutterBottom variant="h5" component="div" sx={{ marginTop: 2, marginLeft: 2 }}>
                        {inviterName} te ha invitado al grupo {groupName}
                    </Typography>
                </Box>
                <Box flex='0.5' display='flex' flexDirection='row' justifyContent='flex-end' alignItems='center' sx={{ marginRight: 5 }}>
                    <Button variant='outlined' size="small" onClick={() => acceptInvitation()}>
                        Aceptar
                    </Button>
                    <Button variant='outlined' size="small" sx={{ marginLeft: 2 }} onClick={() => rejectInvitation()}>
                        Rechazar
                    </Button>
                </Box>
            </Box>

        </Card>
    );
}
