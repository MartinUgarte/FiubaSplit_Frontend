"use client";

import { Box, IconButton, Divider, TextField, Typography, Grid, ThemeProvider, Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import IconTextRow from "../../IconTextRow";
import LoadingModal from "app/LoadingModal";
import { User, dumpExpense, dumpUser } from "app/types";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import GroupsIcon from '@mui/icons-material/Groups';
import ParticipantCard from "./ParticipantCard";
import CategoryIcon from '@mui/icons-material/Category';
import { subheaderTheme } from "app/fonts";

import ImageModal from "./ImageModal";
import ImageIcon from '@mui/icons-material/Image';

export default function Expense() {
    const [expense, setExpense] = useState(dumpExpense);
    // const [showLoading, setShowLoading] = useState(false);
    const [members, setMembers] = useState<{ [key: string]: string }>({}) // Key: userId, Value: userName
    const [balances, setBalances] = useState<{ [key: string]: { [key: string]: number } }>({})
    const [group, setGroup] = useState<string>('');
    const [barrier, setBarrier] = useState<boolean>(false);
    const [showImageModal, setShowImageModal] = useState(false)

    const formatDate = (date: Date) => {
        return `${date.getDate().toString()}/${date.getMonth() + 1
            }/${date.getFullYear()}`;
    };

    const handleAddMember = (key: string, name: string) => {
        console.log('El nombre que llega es: ', name)
        setMembers((prevMembers) => ({
            ...prevMembers,
            [key]: name,
        }));
    };

    const getExpense = () => {
        const jwt = localStorage.getItem("jwtToken");
        const expenseId = localStorage.getItem('expenseId')
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/expenses/${expenseId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwt}`,
            },
        })
            .then((res) => {
                console.log(res);
                if (res.status == 200) {
                    //setShowLoading(false);
                }
                return res.json();
            })
            .then((data) => {
                if (data.id) {
                    setExpense(data);
                    setBalances(data.balances)
                    getGroup(data.group_id)
                    setBarrier(true)
                }
            });
    };

    const getUser = (memberId: string) => {
        const jwt = localStorage.getItem("jwtToken");
        if (!jwt) {
            return Promise.reject(new Error("JWT not found"));
        }
        return fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${memberId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwt}`,
            },
        })
            .then((res) => {
                console.log("El res es: ", res);
                if (!res.ok) {
                    throw new Error("Network response was not ok");
                }
                return res.json();
            })
            .then((data) => data)
            .catch((error) => {
                console.error("Error fetching user:", error);
                return null;
            });
    };


    const getGroup = (groupId: string) => {
        const jwt = localStorage.getItem("jwtToken");

        if (!jwt || !groupId) {
            return;
        }
        //setShowLoading(true);
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/groups/${groupId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwt}`,
            },
        })
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                console.log("Got event: ", data);
                setGroup(data.name);
                //setShowLoading(false);
            });
    };


    useEffect(() => {
        getExpense();
    }, []);

    useEffect(() => {
        if (barrier) {
            Promise.all(Object.keys(balances).map((id) => getUser(id)))
                .then((users) => {
                    users.map((user: User) => {
                        handleAddMember(user.id, user.name);
                    });
                })
                .catch((error) => {
                    console.error("Error fetching users: ", error);
                });
        }
        console.log("Quedaron los members: ", members)
    }, [barrier])

    const getUserBalance = (balance: { [key: string]: number }) => {
        return Object.values(balance).reduce((acum, currVal) => acum + currVal, 0) == 0;
    };

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

            fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/avatar`, {
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
                    getExpense()
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
            {/* <LoadingModal open={showLoading} onClose={() => setShowLoading(false)} /> */}
            <ImageModal open={showImageModal} onClose={() => setShowImageModal(false)} expense={expense} getExpense={() => getExpense()} />
            <Box
                sx={{ marginTop: 5, borderBottom: '1px solid black' }}
                flex="0.2"
                display="flex"
                width="100%"
                flexDirection="row"
                justifyContent="space-between"
                alignItems="center"
            >
                <ThemeProvider theme={subheaderTheme}>
                    <Typography sx={{ marginLeft: 4, marginBottom: 2 }} variant="h3">
                        {expense.name}
                    </Typography>
                </ThemeProvider>
                <IconButton color="primary" onClick={() => setShowImageModal(true)}>
                    <ImageIcon />
                </IconButton>
            </Box>

            <Divider sx={{ borderBottomWidth: 2 }} />
            <Box
                sx={{ marginBottom: 2, marginTop: 3 }}
                display="flex"
                flexDirection="column"
                flex="0.3"
                width="100%"
            >
                <IconTextRow icon={<GroupsIcon sx={{ color: '#487ba9' }} />} text={group} />
                <IconTextRow icon={<TextSnippetIcon sx={{ color: '#487ba9' }} />} text={expense.description} />
                <IconTextRow icon={<AttachMoneyIcon sx={{ color: '#487ba9' }} />} text={expense.amount.toString()} />
                <IconTextRow icon={<CategoryIcon sx={{ color: '#487ba9' }} />} text={expense.category} />
                <IconTextRow
                    icon={<CalendarMonthIcon sx={{ color: '#487ba9' }} />}
                    text={formatDate(new Date(expense.created_date))}
                />

            </Box>
            <Box sx={{ width: '100%' }} display='flex' flexDirection='row' flex='0.1' alignItems='flex-start' justifyContent='space-between'>
                <ThemeProvider theme={subheaderTheme}>
                    <Typography sx={{ fontSize: 30, paddingRight: 10, borderBottom: '1px solid black' }}>Participantes</Typography>
                </ThemeProvider>
            </Box>
            <Box maxHeight='1000px' sx={{ marginTop: 2, maxHeight: '1000px', overflowY: 'auto', width: '100%' }} display="flex" flex="1" flexDirection="column">
                <Grid container spacing={5} >
                    {Object.entries(balances).map(
                        ([memberId, balance]) =>
                            <Grid item xs={12} key={memberId}>
                                <ParticipantCard getExpense={() => getExpense()} isBalanced={getUserBalance(balance)} memberId={memberId} expenseId={expense.id} balance={balance} members={members} />
                            </Grid>
                    )}
                </Grid>
            </Box>
        </Box>
    );
}
