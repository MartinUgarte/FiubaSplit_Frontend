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
import CategoryIcon from '@mui/icons-material/Category';
import DescriptionIcon from '@mui/icons-material/Description';
import IconTextRow from "../../IconTextRow";
import InvitationModal from "./InvitationModal";
import MembersModal from "./MembersModal";
import CreateExpenseModal from "./ChooseExpenseParticipantsModal";

export default function GroupDetails() {
  const [group, setGroup] = useState(dumpGroup);
  const [showEditGroupModal, setShowEditGroupModal] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [showInvitationModal, setShowInvitationModal] = useState(false);
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [showNewExpenseModal, setShowNewExpenseModal] = useState(false);

  const formatDate = (date: Date) => {
    return `${date.getDate().toString()}/${
      date.getMonth() + 1
    }/${date.getFullYear()}`;
  };

  const getGroup = () => {
    const jwt = localStorage.getItem("jwtToken");
    const groupId = localStorage.getItem("groupId");
    
    if (!jwt || !groupId) {
      return;
    }
    setShowLoading(true);
    fetch(`http://localhost:8000/groups/${groupId}`, {
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
      getGroup();
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
      <CreateExpenseModal group={group} open={showNewExpenseModal} onClose={() => setShowNewExpenseModal(false)} />
      <MembersModal open={showMembersModal} onClose={() => setShowMembersModal(false)} group={group} getGroup={() => getGroup()}/>
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
          <Button variant="contained" onClick={() => setShowNewExpenseModal(true)}>
            Añadir gasto
          </Button>
          <Button sx={{marginLeft: 2}} variant="contained" onClick={() => setShowMembersModal(true)}>
            Ver miembros
          </Button>
          {checkAdmin() && <Button sx={{marginLeft: 2, marginRight: 5}}variant="contained" onClick={() => setShowInvitationModal(true)}>
            Añadir miembro
          </Button>}
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
        {group.description != "" && (<IconTextRow icon={<DescriptionIcon />} text={group.description} />)}
        <IconTextRow icon={<CategoryIcon />} text={group.category} />
      </Box>
    </Box>
  );
}
