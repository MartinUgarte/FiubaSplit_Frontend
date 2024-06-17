"use client";

import * as React from 'react';
import Link from 'next/link';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import GroupsIcon from '@mui/icons-material/Groups';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person2';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import Badge from '@mui/material/Badge/Badge';
import { createContext, useEffect, useState } from 'react';


const DRAWER_WIDTH = 240;

const LINKS = [
    { text: 'Grupos', href: '/groups', icon: GroupsIcon },
    { text: 'Perfil', href: '/profile', icon: PersonIcon },
    { text: 'Notificaciones', href: '/notifications', icon: NotificationsIcon },
    { text: 'Gastos', href: '/expenses', icon: AttachMoneyIcon },
    { text: 'Deudas', href: '/debts', icon: CurrencyExchangeIcon }
];

const PLACEHOLDER_LINKS = [
    { text: 'Cerrar Sesión', href: '/login', icon: LogoutIcon },
];




export default function RootLayout({ children }: { children: React.ReactNode }) {
    const [debtsCount, setDebtsCount] = useState(0)
    const [notificationsCount, setNotificationsCount] = useState(0)

    useEffect(() => {
        getDebts();
        // getInvitations()
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
                setNotificationsCount(data.length)
            });
    };
    
    const getInvitations = () => {
        const jwtToken = localStorage.getItem("jwtToken")
        const userId = localStorage.getItem("userId")
        if (!jwtToken || !userId) {
            return;
        }

        fetch(`${process.env.NEXT_PUBLIC_API_URL}/invitations/groups`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwtToken}`,
            },
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Network response was not ok");
                }
                return res.json();
            })
            .then((data) => {
                console.log("Got invitations: ", data);
                //setNotificationsCount(data.length)
            });
    };


    const getDebts = () => {
        const jwt = localStorage.getItem("jwtToken");

        if (!jwt) {
            return;
        }

        fetch(`${process.env.NEXT_PUBLIC_API_URL}/debts`, {
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
                console.log("Got debts: ", data);
                setDebtsCount(data.debts.length)
            });
    };

    return (
        <html lang="en">
            <body>
                <AppBar position="fixed" sx={{ zIndex: 2000 }}>
                    <Toolbar sx={{ backgroundColor: '#5696d1' }}>
                        <Box
                            component="img"
                            sx={{
                                height: 40,
                                width: 40,
                                marginRight: 2
                            }}
                            alt="The house from the offer."
                            src="https://i.imgur.com/ZP4O5bA.png"
                        />
                        <Typography variant="h6" noWrap component="div" color="white" sx={{ marginTop: 0.5 }}>
                            FiubaSplit
                        </Typography>
                    </Toolbar>
                </AppBar>
                <Drawer
                    sx={{
                        width: DRAWER_WIDTH,
                        flexShrink: 0,
                        '& .MuiDrawer-paper': {
                            width: DRAWER_WIDTH,
                            boxSizing: 'border-box',
                            top: ['48px', '56px', '64px'],
                            height: 'auto',
                            bottom: 0,
                            backgroundColor: '#487ba9',
                            color: 'white'
                        },
                    }}
                    variant="permanent"
                    anchor="left"
                >
                    <Divider />
                    <List>
                        {LINKS.map(({ text, href, icon: Icon }) => (
                            <>
                                <Divider sx={{ color: 'white', height: '3px' }} />
                                <ListItem key={href} disablePadding>
                                    <ListItemButton component={Link} href={href}>
                                        <ListItemIcon sx={{ color: 'white' }}>
                                            {text == 'Deudas' ? (
                                                <Badge badgeContent={debtsCount} color="error">
                                                    <Icon />
                                                </Badge>
                                            ) : text == 'Notificaciones' ? (
                                                <Badge badgeContent={notificationsCount} color="error">
                                                    <Icon />
                                                </Badge>
                                            ) : (
                                                <Icon />
                                            )}


                                        </ListItemIcon>
                                        <ListItemText primary={text} />

                                    </ListItemButton>
                                </ListItem>
                            </>
                        ))}
                    </List>
                    <Divider sx={{ mt: 'auto' }} />
                    <List>
                        {PLACEHOLDER_LINKS.map(({ text, href, icon: Icon }) => (
                            <ListItem key={text} disablePadding>
                                <ListItemButton component={Link} href={href}>
                                    <ListItemIcon sx={{ color: 'white' }}>
                                        <Icon />
                                    </ListItemIcon>
                                    <ListItemText primary={text} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </Drawer>
                <Box
                    component="main"
                    sx={{
                        flexGrow: 1,
                        bgcolor: 'background.default',
                        ml: `${DRAWER_WIDTH}px`,
                        mt: ['48px', '56px', '64px'],
                        p: 3,
                    }}
                >
                    {children}
                </Box>
            </body>
        </html>
    );
}

