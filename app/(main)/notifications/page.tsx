"use client";

import { useEffect, useState } from "react";
import { Box, Button, Grid, Typography } from "@mui/material";
import { Group, Invitation, PaymentNotification, dumpGroup, dumpInvitation } from "app/types";
import LoadingModal from 'app/LoadingModal';
import NotificationCard from "./NotificationCard";


export default function NotificationsHome() {
    const [notifications, setNotifications] = useState<PaymentNotification[]>([]);

    useEffect(() => {
        getNotifications();
    }, []);

    const getNotifications = () => {
        const jwt = localStorage.getItem("jwtToken");

        if (!jwt) {
            return;
        }

        fetch(`${process.env.NEXT_PUBLIC_API_URL}/notifications`, {
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
                console.log("Got notifications: ", data);
                setNotifications(
                    data.map((notification: PaymentNotification) => {
                        return {
                            id: notification.id,
                            group_id: notification.group_id,
                            debtor_id: notification.debtor_id,
                            user_id: notification.user_id,
                            amount: notification.amount
                        };
                    })
                );
            });
    };

    return (
        <Box display="flex" flex="1" flexDirection="column">
            <Box display="flex" flexDirection='column' flex="1">
                <Grid container spacing={5} sx={{ marginTop: 1 }}>
                    {notifications.map(
                        (notification) =>
                        (
                            <Grid item xs={12} key={notification.id}>
                                <NotificationCard notification={notification} />
                            </Grid>
                        )
                    )}
                </Grid>
            </Box>
        </Box>
    );
}
