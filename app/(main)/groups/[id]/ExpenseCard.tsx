import * as React from "react";
import Card from "@mui/material/Card";
import EditIcon from '@mui/icons-material/Edit';
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/navigation";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import { Expense, Invitation } from "@/app/types";
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import EditExpenseModal from "./EditExpenseModal";

type ExpenseCardProps = {
  expense: Expense;
  getExpenses: () => void;
};

export default function ExpenseCard({
  expense,
  getExpenses,
}: ExpenseCardProps) {
  const router = useRouter();
  const [showEditExpenseModal, setShowEditExpenseModal] = useState(false)

  const checkCreator = () => {
    const userId = localStorage.getItem("userId");
    return userId == expense.creator_id;
  };

  const deleteExpense = () => {
    const jwt = localStorage.getItem("jwtToken");
    fetch(`http://localhost:8000/expenses/${expense.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
    }).then((res) => {
      getExpenses();
    });
  };

  return (
    <Card style={{ borderTop: "2px solid blue", height: 100 }}>
    <Box flex='1' display='flex' flexDirection='row' height="100%">
        <EditExpenseModal expense={expense} getExpenses={() => getExpenses()} open={showEditExpenseModal} onClose={() => setShowEditExpenseModal(false)} />
        <Box flex='0.3' display='flex' flexDirection='row' justifyContent='flex-start' alignItems='center' sx={{marginLeft: 5}}>
            <GroupAddIcon sx={{fontSize: 40}}/>
            <Typography gutterBottom variant="h5" component="div" sx={{marginTop: 2, marginLeft: 2}}>
            {expense.name}
          </Typography>
        </Box>
        <Box
          flex="0.3"
          display="flex"
          flexDirection="row"
          justifyContent="flex-start"
          alignItems="center"
          sx={{ marginLeft: 5 }}
        >
          <Typography
            gutterBottom
            variant="h5"
            component="div"
            sx={{ marginTop: 2, marginLeft: 2 }}
          >
            {expense.amount}
          </Typography>
        </Box>
        <Box
          flex="0.4"
          display="flex"
          flexDirection="row"
          justifyContent="flex-end"
          alignItems="center"
          sx={{ marginLeft: 5 }}
        >

          {/* {checkCreator() && ( */}
            <IconButton color="primary" onClick={() => deleteExpense()} sx={{marginRight:5, marginLeft:2}}>
              <DeleteIcon />
            </IconButton>
          {/* )} */}
          
            <IconButton sx={{marginRight: 10}} aria-label="edit" onClick={() => setShowEditExpenseModal(true)}>
                <EditIcon sx={{fontSize: 30}} />
            </IconButton>

         
        </Box>
      </Box>
    </Card>
  );
}