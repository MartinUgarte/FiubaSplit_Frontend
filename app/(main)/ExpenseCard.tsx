import * as React from "react";
import Card from "@mui/material/Card";
import EditIcon from '@mui/icons-material/Edit';
import Typography from "@mui/material/Typography";
import { useRouter } from "next/navigation";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import { Box, Button } from "@mui/material";
import { useEffect, useState } from "react";
import { Expense, Invitation } from "app/types";
import EditExpenseModal from "./groups/[id]/EditExpenseModal";
import ReceiptIcon from '@mui/icons-material/Receipt';
import CustomModal from "../CustomModal";
import { API_URL } from "../constants";

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
  const [showEditExpenseModal, setShowEditExpenseModal] = useState(false);
  const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] = useState(false);
  const [groupName, setGroupName] = useState('');


  const checkCreator = () => {
    const userId = localStorage.getItem("userId");
    return userId == expense.creator_id;
  };

  const deleteExpense = () => {
    setShowDeleteConfirmationModal(false)
    const jwt = localStorage.getItem("jwtToken");
    console.log('EL ID ES: ', expense.id)
    fetch(`${API_URL}/expenses/${expense.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
    }).then((res) => {
      getExpenses();
    });
  };

  const getGroup = () => {
    const jwt = localStorage.getItem("jwtToken");

    if (!jwt) {
      return;
    }
    fetch(`${API_URL}/groups/${expense.group_id}`, {
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
        console.log("Got group: ", data);
        setGroupName(data.name);
      });
  };

  useEffect(() => {
    getGroup();
  }, []);

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
        <Box flex='0.25' display='flex' flexDirection='row' justifyContent='flex-start' alignItems='center' sx={{marginLeft: 5}}>
            <ReceiptIcon sx={{fontSize: 40, color:'#487ba9'}}/>
            <Typography gutterBottom variant="h5" component="div" sx={{marginTop: 2, marginLeft: 2}}>
            {expense.name}
          </Typography>
        </Box>
        <Box
          flex="0.25"
          display="flex"
          flexDirection="row"
          justifyContent="center"
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
          flex="0.25"
          display="flex"
          flexDirection="row"
          justifyContent="center"
          alignItems="center"
          sx={{ marginLeft: 5 }}
        >
          <Typography
            gutterBottom
            variant="h5"
            component="div"
            sx={{ marginTop: 2, marginLeft: 2 }}
          >
            {groupName}
          </Typography>
        </Box>
        <Box
          flex="0.25"
          display="flex"
          flexDirection="row"
          justifyContent="center"
          alignItems="center"
          
        >
          <Box width='50%' display='flex' flex='0.5' flexDirection='row' justifyContent='center'>
          {checkCreator() && (
            <Box display='flex' flex='1'>
            <IconButton color="primary" onClick={() => setShowDeleteConfirmationModal(true)} sx={{marginRight:'1%', marginLeft:'0.5%'}}>
              <DeleteIcon />
            </IconButton>
            <IconButton sx={{marginRight: '1%'}} aria-label="edit" onClick={() => setShowEditExpenseModal(true)}>
                <EditIcon sx={{fontSize: 30}} />
            </IconButton>
            </Box>

          )}
          </Box>
          <Box width='100%' display='flex' flex='0.5' flexDirection='row' justifyContent={'center'}>
            <Button size="small" onClick={() => handleDetails()}>DETALLES</Button>
          </Box>
        </Box>
      </Box>
    </Card>
  );
}