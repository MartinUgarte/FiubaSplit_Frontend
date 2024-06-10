"use client";

import { useEffect, useState } from "react";
import InvitationCard from "./InvitationCard";
import { Box, Button, Grid } from "@mui/material";
import { Group, Invitation, dumpGroup, dumpInvitation } from "@/app/types";
import LoadingModal from '@/app/LoadingModal';

export default function NotificationsHome() {
  const [invitations, setInvitations] = useState<Invitation[]>([dumpInvitation]);
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => {
    getInvitations();
  }, []);

  const getInvitations = () => {
    const jwtToken = localStorage.getItem("jwtToken")
    const userId = localStorage.getItem("userId")
    if (!jwtToken || !userId) {
      return;
    }
    setShowLoading(true);
    fetch(`${API_URL}/invitations/groups`, {
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
        setInvitations(
            data.map((invitation: Invitation) => {
              return {
                id: invitation.id,
                group_id: invitation.group_id,
                invited_by_id: invitation.invited_by_id,
                invited_user_id: invitation.invited_user_id,
                status: invitation.status
              };
            })
          );
        setShowLoading(false);
      });
  };

  return (
    <Box display="flex" flex="1" flexDirection="column">
        <LoadingModal open={showLoading} onClose={() => setShowLoading(false)} />
      <Box display="flex" flexDirection='column' flex="1">
        <Grid container spacing={5} sx={{ marginTop: 1 }}>
          {invitations.map(
            (invitation) =>
              (
                <Grid item xs={12} key={invitation.id}>
                  <InvitationCard invitation={invitation} getInvitations={() => getInvitations()} />
                </Grid>
              )
          )}
        </Grid>
      </Box>
    </Box>
  );
}
