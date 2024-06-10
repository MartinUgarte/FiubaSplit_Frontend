import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { Box, IconButton } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect, useState } from "react";
import LoadingModal from "app/LoadingModal";
import GppGoodIcon from '@mui/icons-material/GppGood';
import { API_URL } from "app/constants";

type MemberCardProps = {
  memberId: string;
  creatorId: string;
  getGroup: () => void;
};

export default function MemberCard({
  memberId,
  creatorId,
  getGroup,
}: MemberCardProps) {
  const [memberName, setMemberName] = useState("");
  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => {
    getUser();
  }, []);

  const checkAdmin = () => {
    return localStorage.getItem("userId") == creatorId;
  };

  const checkMe = () => {
    return localStorage.getItem("userId") != memberId
  }

  const handleDeleteMember = () => {
    const jwt = localStorage.getItem("jwtToken");
    const groupId = localStorage.getItem("groupId");
    if (!jwt || !groupId) {
      return;
    }
    setShowLoading(true);

    fetch(`${API_URL}/groups/${groupId}/delete-member/${memberId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
    }).then((res) => {
        console.log(res)
        getGroup();
        setShowLoading(false);
    });
  };

  const getUser = () => {
    const jwt = localStorage.getItem("jwtToken");
    if (!jwt) {
      return;
    }
    fetch(`${API_URL}/users/${memberId}`, {
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
        setMemberName(data.name);
      });
  };

  return (
    <Card>
      <CardContent>
        <Box
          display="flex"
          flex="1"
          justifyContent="space-between"
          alignItems="center"
          flexDirection="row"
        >
          <LoadingModal
            open={showLoading}
            onClose={() => setShowLoading(false)}
          />

          <Box
            display="flex"
            flex="0.5"
            justifyContent="flex-start"
            alignItems="center"
          >
            <Typography color="black" variant="h5">
              {memberName}
            </Typography>
          </Box>
          <Box
            display="flex"
            flex="0.5"
            justifyContent="flex-end"
            alignItems="center"
          >
            {checkAdmin() && checkMe() && (
              <Box>
              <IconButton color="primary" onClick={() => handleDeleteMember()}>
                <DeleteIcon />
              </IconButton>
              <IconButton color="primary" onClick={() => handleDeleteMember()}>
              <GppGoodIcon />
            </IconButton>
            </Box>
            )}
            
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
