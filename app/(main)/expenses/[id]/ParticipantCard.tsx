import * as React from "react";
import Image from "next/image";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/router";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import BalanceModal from "./BalanceModal";

type ParticipantCardProps = {
  memberId: string,
  members: {[key: string]: string},
  balance: {[key: string]: number},
};

export default function ParticipantCard({ memberId, members, balance }: ParticipantCardProps) {
  const [showBalanceModal, setShowBalanceModal] = useState(false);

  const getUserBalance = () => {
    return Object.values(balance).reduce((acum, currVal) => acum + currVal, 0);
  };

  const userBalance = getUserBalance();

  return (
    <Card sx={{ borderTop: "2px solid blue", height: "100px", marginRight: 2 }}>
      <Box display='flex' flexDirection='row' justifyContent='center' alignItems='center' height="100%">
      <Box
          flex="0.5"
          display="flex"
          sx={{marginLeft: 5}}
          flexDirection="row"
          justifyContent="flex-start"
          alignItems='center'
        >
          <AccountBoxIcon sx={{ fontSize: 40, mr: 2 }} />
          <Typography sx={{marginTop:2}} variant="h5" gutterBottom>
            {members[memberId]}
          </Typography>
          {/* <Typography variant="subtitle1">
            Balance: ${userBalance}
          </Typography> */}
        </Box>
        <Box sx={{marginRight: 5}}flex="0.5" display="flex" justifyContent="flex-end">
          <Button onClick={() => setShowBalanceModal(true)} variant="outlined">
            DETALLES
          </Button>
        </Box>

          <BalanceModal open={showBalanceModal} onClose={() => setShowBalanceModal(false)} memberId={memberId} members={members} balance={balance} />
      
      </Box>
    </Card>
  );
}
