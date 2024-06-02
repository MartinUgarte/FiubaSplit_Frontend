import * as React from "react";
import Card from "@mui/material/Card";
import EditIcon from '@mui/icons-material/Edit';
import Typography from "@mui/material/Typography";
import { useRouter } from "next/navigation";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import { Box, Button } from "@mui/material";
import { useEffect, useState } from "react";
import { Expense, Invitation } from "@/app/types";
import EditExpenseModal from "./groups/[id]/EditExpenseModal";
import ReceiptIcon from '@mui/icons-material/Receipt';
import CustomModal from "../CustomModal";

type ExpenseCardProps = {
  expense: Expense;
  getExpenses: () => void;
  route: string;
};

export default function ExpenseCard({
  expense,
  getExpenses,
  route,
}: ExpenseCardProps) {
  const router = useRouter();
  const [showEditExpenseModal, setShowEditExpenseModal] = useState(false)
  const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] = useState(false);


  const checkCreator = () => {
    const userId = localStorage.getItem("userId");
    return userId == expense.creator_id;
  };

  const deleteExpense = () => {
    setShowDeleteConfirmationModal(false)
    const jwt = localStorage.getItem("jwtToken");
    console.log('EL ID ES: ', expense.id)
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

  const handleDetails = () => {
    console.log('ID: ', expense.id);
    localStorage.setItem('expenseId', expense.id);
    router.push(`${route}/${expense.id}`)
  }

  return (
    <Card style={{ borderTop: "2px solid blue", height: 100, marginRight: 10 }}>
    <Box flex='1' display='flex' flexDirection='row' height="100%">
    {showDeleteConfirmationModal && (<CustomModal open={showDeleteConfirmationModal} onClick={() => deleteExpense()} onClose={() => setShowDeleteConfirmationModal(false)} text="Eliminar Gasto" buttonText='Confirmar'/>)}

        <EditExpenseModal expense={expense} getExpenses={() => getExpenses()} open={showEditExpenseModal} onClose={() => setShowEditExpenseModal(false)} />
        <Box flex='0.3' display='flex' flexDirection='row' justifyContent='flex-start' alignItems='center' sx={{marginLeft: 5}}>
            <ReceiptIcon sx={{fontSize: 40}}/>
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
            $ {Intl.NumberFormat('de-DE').format(expense.amount)}
          </Typography>
        </Box>
        <Box
          flex="0.4"
          display="flex"
          flexDirection="row"
          justifyContent="flex-end"
          alignItems="center"
          sx={{ marginLeft: 5, marginRight: 5}}
        >

          {checkCreator() && (
            <>
            <IconButton color="primary" onClick={() => setShowDeleteConfirmationModal(true)} sx={{marginRight:5, marginLeft:2}}>
              <DeleteIcon />
            </IconButton>
         
          
            <IconButton sx={{marginRight: 10}} aria-label="edit" onClick={() => setShowEditExpenseModal(true)}>
                <EditIcon sx={{fontSize: 30}} />
            </IconButton>
            </>

          )}
            <Button size="small" onClick={() => handleDetails()}>DETALLES</Button>
         
        </Box>
      </Box>
    </Card>
  );
}