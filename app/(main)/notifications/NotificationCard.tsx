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
import { Invitation, PaymentNotification } from "app/types";
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';


type NotificationCardProps = {
    notification: PaymentNotification;
};

export default function NotificationCard({ notification }: NotificationCardProps) {
    const router = useRouter();
    const [groupName, setGroupName] = useState("");
    const [debtorName, setDebtorName] = useState("");

    useEffect(() => {
        getGroup();
        getUser();
    }, []);

    const getUser = () => {
        const jwt = localStorage.getItem("jwtToken");
        if (!jwt) {
            return;
        }
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${notification.debtor_id}`, {
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
                setDebtorName(data.name);
            });
    };

    const getGroup = () => {
        const jwt = localStorage.getItem("jwtToken");
        if (!jwt) {
            return;
        }
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/groups/${notification.group_id}`, {
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


    return (
        <Card style={{ borderTop: "2px solid #64a8e3", height: 100 }}>
            <Box flex='1' display='flex' flexDirection='row' height="100%">
                <Box flex='1' display='flex' flexDirection='row' justifyContent='flex-start' alignItems='center' sx={{ marginLeft: 5 }}>
                    <NotificationsActiveIcon sx={{ fontSize: 40 }} />
                    <Typography gutterBottom variant="h5" component="div" sx={{ marginTop: 2, marginLeft: 2 }}>
                        {debtorName} te ha pagado ${notification.amount * -1} del grupo {groupName}
                    </Typography>
                </Box>
            </Box>

        </Card>
    );
}
