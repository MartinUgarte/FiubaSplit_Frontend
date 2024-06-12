"use client";

import { Box, IconButton, Divider, TextField, Typography, ThemeProvider, Avatar } from "@mui/material";
import React, { useEffect, useState } from "react";
import IconTextRow from "../IconTextRow";
import LoadingModal from "app/LoadingModal";
import { dumpUser } from "app/types";
import EmailIcon from "@mui/icons-material/Email";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import CakeIcon from "@mui/icons-material/Cake";
import EditUserModal from "./EditUserModal";
import EditIcon from '@mui/icons-material/Edit';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import { subheaderTheme } from "app/fonts";
import { API_URL } from "app/constants";

export default function Profile() {
    const [user, setUser] = useState(dumpUser);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showLoading, setShowLoading] = useState(false);

    const formatDate = (date: Date) => {
        return `${date.getDate().toString()}/${(date.getMonth() + 1)}/${date.getFullYear()}`
    }


    const getMe = () => {
        const jwt = localStorage.getItem("jwtToken");
        fetch(`${API_URL}/me`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwt}`,
            },
        })
            .then((res) => {
                console.log(res);
                if (res.status == 200) {
                    setShowLoading(false);
                }
                return res.json();
            })
            .then((data) => {
                console.log("La data: ", data);
                if (data.id) {
                    setUser(data);
                }
            });
    };

    useEffect(() => {
        getMe();
    }, []);

    const handleFileChange = (event: any) => {
        const jwt = localStorage.getItem("jwtToken");
        if (!jwt) {
            return;
        }
        const file = event.target.files[0];
        if (file) {
            console.log('Selected file:', file);

            //const exampleFile = fs.createReadStream(path.join(__dirname, "./avatar"));

            const form = new FormData();
            form.append("avatar", file);

            fetch(`${API_URL}/users/avatar`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
                body: form as any // Cast to any to bypass TypeScript type checking for fetch body
            })
                .then((res) => {
                    if (!res.ok) {
                        throw new Error("Network response was not ok");
                    }
                    return res.json();
                })
                .then((data) => {
                    console.log("Avatar uploaded: ", data);
                    getMe()
                })
                .catch((error) => {
                    console.error("Error uploading file:", error);
                });
        }
    }

    return (
        <Box
            display="flex"
            flex="1"
            flexDirection="column"
            height="100vh"
            alignItems="center"
            justifyContent="center"
        >
            {user != dumpUser && (<EditUserModal
                open={showEditModal}
                onClose={() => setShowEditModal(false)}
                getMe={() => getMe()}
                user={user}
            />)}
            <LoadingModal open={showLoading} onClose={() => setShowLoading(false)} />
            <Box
                flex="0.2"
                display="flex"
                width="100%"
                flexDirection='row'
                justifyContent='space-between'
                alignItems='center'
                sx={{ marginTop: 5, paddingBottom: 2, borderBottom: '1px solid black', width: '100%' }}
            >
                <Box flex='0.6' display='flex' justifyContent='flex-start' alignItems='center'>
                    <Box>
                        <div>
                            <input
                                accept="image/*"
                                style={{ display: 'none' }}
                                id="upload-photo"
                                type="file"
                                onChange={handleFileChange}
                            />
                            <label htmlFor="upload-photo">
                                <IconButton component="span">
                                    <Avatar
                                        alt="User Avatar"
                                        src={user.avatar_link}
                                        sx={{ width: 100, height: 100, border: '2px solid black', borderColor: '#5696d1' }}
                                    />
                                </IconButton>
                            </label>
                        </div>
                    </Box>
                    <Box sx={{ ml: '2%' }}>
                        <ThemeProvider theme={subheaderTheme}>
                            <Typography sx={{ marginBottom: 2 }} variant="h3">
                                {user.name} {user.surname}
                            </Typography>
                        </ThemeProvider>
                    </Box>
                </Box>
                <Box display='flex' flex='0.4' justifyContent='flex-end'>
                    <IconButton aria-label="edit" onClick={() => setShowEditModal(true)}>
                        <EditIcon sx={{ fontSize: 40, color: '#5696d1' }} />
                    </IconButton>
                </Box>

            </Box>

            <Divider sx={{ borderBottomWidth: 2, borderColor: '#5696d1' }} />
            <Box
                sx={{ marginBottom: 2, marginTop: 3 }}
                display="flex"
                flexDirection="column"
                flex="0.8"
                width="100%"
            >
                <IconTextRow icon={<EmailIcon sx={{ color: '#487ba9' }} />} text={user.email} />
                <IconTextRow icon={<LocalPhoneIcon sx={{ color: '#487ba9' }} />} text={user.phone} />
                <IconTextRow icon={<CakeIcon sx={{ color: '#487ba9' }} />} text={formatDate(new Date(user.date_of_birth))} />
                {user.cbu && <IconTextRow icon={<AccountBalanceIcon sx={{ color: '#487ba9' }} />} text={user.cbu} />}
            </Box>
        </Box>
    );
}
