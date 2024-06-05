import * as React from "react";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/material";
import { useState } from "react";
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import BalanceModal from "./BalanceModal";

type ParticipantCardProps = {
  memberId: string,
  members: { [key: string]: string },
  balance: { [key: string]: number },
  isBalanced: boolean,
  expenseId: string
};

export default function ParticipantCard({ memberId, members, balance, isBalanced, expenseId }: ParticipantCardProps) {
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
          sx={{ marginLeft: 5 }}
          flexDirection="row"
          justifyContent="flex-start"
          alignItems='center'
        >
          <AccountBoxIcon sx={{ fontSize: 40, mr: 2 }} />
          <Typography sx={{ marginTop: 2 }} variant="h5" gutterBottom>
            {localStorage.getItem('userId') == memberId ? 'Tú' : members[memberId]}
          </Typography>
        </Box>
        <Box sx={{ marginRight: 5 }} flex="0.5" display="flex" justifyContent="flex-end">
          {isBalanced ? (
            <Typography>No hay deudas</Typography>
          ) :
            (
              <Button onClick={() => setShowBalanceModal(true)} variant="outlined">
                DETALLES
              </Button>
            )
          }
        </Box>

        <BalanceModal expenseId={expenseId} open={showBalanceModal} onClose={() => setShowBalanceModal(false)} memberId={memberId} members={members} balance={balance} />

      </Box>
    </Card>
  );
}
