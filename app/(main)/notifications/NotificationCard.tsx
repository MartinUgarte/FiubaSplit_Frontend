import * as React from "react";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/navigation";
import IconButton from "@mui/material/IconButton";
import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import { PaymentNotification } from "app/types";
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import CheckIcon from '@mui/icons-material/Check';

type NotificationCardProps = {
    notification: PaymentNotification;
    getNotifications: () => void;
};

export default function NotificationCard({ notification, getNotifications }: NotificationCardProps) {
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

    const deleteNotification = () => {
        const jwt = localStorage.getItem("jwtToken");
        if (!jwt) {
            return;
        }
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/notifications/${notification.id}`, {
            method: "DELETE",
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
                console.log("Got data after deleting notification: ", data);
                window.location.reload();
            });
    };


    return (
        <Card style={{ borderTop: "2px solid #64a8e3", height: 100 }}>
            <Box flex='1' display='flex' flexDirection='row' height="100%">
                <Box flex='0.9' display='flex' flexDirection='row' justifyContent='flex-start' alignItems='center' sx={{ marginLeft: 5 }}>
                    <NotificationsActiveIcon sx={{ fontSize: 40 }} />
                    <Typography gutterBottom variant="h5" component="div" sx={{ marginTop: 2, marginLeft: 2 }}>
                        {debtorName} te ha pagado ${notification.amount} del grupo {groupName}
                    </Typography>
                </Box>
                <Box flex='0.1' display='flex' justifyContent='center'>
                    <IconButton
                        onClick={() => deleteNotification()}
                    >
                        <CheckIcon sx={{fontSize: 35, color: '#5696d1'}}/>
                    </IconButton>
                </Box>
            </Box>

        </Card>
    );
}
