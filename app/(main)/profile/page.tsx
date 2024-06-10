"use client";

import { Box, IconButton, Divider, TextField, Typography, ThemeProvider } from "@mui/material";
import React, { useEffect, useState } from "react";
import IconTextRow from "../IconTextRow";
import LoadingModal from "app/LoadingModal";
import { dumpUser } from "app/types";
import EmailIcon from "@mui/icons-material/Email";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import CakeIcon from "@mui/icons-material/Cake";
import PersonIcon from "@mui/icons-material/Person";
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
          console.log("El user es: ", user);
        }
      });
  };

  useEffect(() => {
    getMe();
  }, []);

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
        /> )}
      <LoadingModal open={showLoading} onClose={() => setShowLoading(false)} />
      <Box
        flex="0.2"
        display="flex"
        width="100%"
        flexDirection='row'
        justifyContent='space-between'
        alignItems='center'
        sx={{marginTop: 5, borderBottom: '1px solid black', width: '100%'}}
      >
        <ThemeProvider theme={subheaderTheme}>
          <Typography sx={{ marginLeft: 4, marginBottom: 2 }} variant="h3">
            Mi perfil
          </Typography>
          </ThemeProvider>
        <IconButton sx={{marginRight: 10}} aria-label="edit" onClick={() => setShowEditModal(true)}>
            <EditIcon sx={{fontSize: 40}} />
        </IconButton>
      </Box>

      <Divider sx={{ borderBottomWidth: 2 }} />
      <Box
        sx={{ marginBottom: 2, marginTop: 3 }}
        display="flex"
        flexDirection="column"
        flex="0.8"
        width="100%"
      >
        <IconTextRow icon={<PersonIcon sx={{color: '#487ba9'}} />} text={user.name} />
        <IconTextRow icon={<PersonIcon sx={{color: '#487ba9'}} />} text={user.surname} />
        <IconTextRow icon={<EmailIcon sx={{color: '#487ba9'}} />} text={user.email} />
        <IconTextRow icon={<LocalPhoneIcon sx={{color: '#487ba9'}} />} text={user.phone} />
        <IconTextRow icon={<CakeIcon sx={{color: '#487ba9'}} />} text={formatDate(new Date(user.date_of_birth))} />
        {user.cbu && <IconTextRow icon={<AccountBalanceIcon sx={{color: '#487ba9'}} />} text={user.cbu} />}
      </Box>
    </Box>
  );
}
