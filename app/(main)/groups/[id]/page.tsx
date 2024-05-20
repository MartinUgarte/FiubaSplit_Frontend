"use client";

import {
  Box,
  IconButton,
  Divider,
  TextField,
  Typography,
  Button,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import LoadingModal from "@/app/LoadingModal";
import { dumpGroup, dumpUser } from "@/app/types";
import PersonIcon from "@mui/icons-material/Person";
import EditIcon from "@mui/icons-material/Edit";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import IconTextRow from "../../IconTextRow";
import InvitationModal from "./InvitationModal";

export default function GroupDetails() {
  const [group, setGroup] = useState(dumpGroup);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [showInvitationModal, setShowInvitationModal] = useState(false)

  const formatDate = (date: Date) => {
    return `${date.getDate().toString()}/${
      date.getMonth() + 1
    }/${date.getFullYear()}`;
  };

  const getGroup = (id: string) => {
    const jwt = localStorage.getItem("jwtToken");
    setShowLoading(true);
    if (!jwt) {
      return;
    }
    fetch(`http://localhost:8000/groups/${id}`, {
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
        console.log("Got event: ", data);
        setGroup(data);
        setShowLoading(false);
      });
  };

  useEffect(() => {
    const storedId = localStorage.getItem("groupId");
    if (storedId) {
      getGroup(storedId);
    }
  }, []);

  const checkAdmin = () => {
    return localStorage.getItem('userId') == group.creator_id
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
      <LoadingModal open={showLoading} onClose={() => setShowLoading(false)} />
      <InvitationModal open={showInvitationModal} onClose={() => setShowInvitationModal(false)} />
      <Box
        sx={{ marginTop: 5 }}
        flex="0.2"
        display="flex"
        width="100%"
        flexDirection="row"
        alignItems="center"
      >
        <Box
          flex="0.5"
          display='flex'
          flexDirection="row"
          justifyContent="flex-start"
          alignItems="center"
          sx={{height: '100%', width: '100%'}}
        >
          <Typography sx={{ marginLeft: 4, marginBottom: 2 }} variant="h3">
            {group.name}
          </Typography>
        </Box>
        <Box
          flex="0.5"
          display='flex'
          flexDirection="row"
          justifyContent="flex-end"
          alignItems="center"
          sx={{height: '100%', width: '100%'}}
        >
          {checkAdmin() && <Button variant="contained" onClick={() => setShowInvitationModal(true)}>
            Añadir miembro
          </Button>}
          <IconButton
            sx={{ marginRight: 10, marginLeft: 5 }}
            aria-label="edit"
            onClick={() => setShowEditModal(true)}
          >
            {checkAdmin() && <EditIcon sx={{ fontSize: 40 }} />}
          </IconButton>
        </Box>
      </Box>

      <Divider sx={{ borderBottomWidth: 2 }} />
      <Box
        sx={{ marginBottom: 2, marginTop: 3 }}
        display="flex"
        flexDirection="column"
        flex="0.8"
        width="100%"
      >
        <IconTextRow icon={<PersonIcon />} text={group.description} />
        <IconTextRow icon={<PersonIcon />} text={group.category} />
      </Box>
    </Box>
  );
}
