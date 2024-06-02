import * as React from "react";
import Card from "@mui/material/Card";
import EditIcon from "@mui/icons-material/Edit";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/navigation";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import { Box, Button } from "@mui/material";
import { useEffect, useState } from "react";
import { Debt, Expense, Invitation } from "@/app/types";
import ReceiptIcon from "@mui/icons-material/Receipt";
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';

type DebtCardProps = {
  debt: Debt;
  getDebts: () => void;
};


export default function DebtCard({ debt, getDebts }: DebtCardProps) {
    const [memberName, setMemberName] = useState<string>('');
    const [groupName, setGroupName] = useState<string>('');
    const [expenseName, setExpenseName] = useState<string>('');

    const getUser = () => {
        const jwt = localStorage.getItem("jwtToken");
        if (!jwt) {
          return;
        }
        fetch(`http://localhost:8000/users/${debt.user_to_pay}`, {
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


      const getGroup = () => {
        const jwt = localStorage.getItem("jwtToken");
    
        if (!jwt) {
          return;
        }
        fetch(`http://localhost:8000/groups/${debt.group_id}`, {
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

      const getExpense = () => {
        const jwt = localStorage.getItem("jwtToken");
        fetch(`http://localhost:8000/expenses/${debt.expense_id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`,
          },
        })
          .then((res) => {
            console.log(res);
            return res.json();
          })
          .then((data) => {
            if (data.id) {
              setExpenseName(data.name);
            }
          });
      };

  useEffect(() => {
    getUser();
    getGroup();
    getExpense();
  }, []);

  return (
    <Card style={{ borderTop: "2px solid blue", height: 100, marginRight: 10 }}>
      <Box flex="1" display="flex" flexDirection="row" height="100%">
        <Box
          flex="0.25"
          display="flex"
          flexDirection="row"
          justifyContent="flex-start"
          alignItems="center"
          sx={{ marginLeft: 5 }}
        >
          <ReceiptIcon sx={{ fontSize: 40, color:'#487ba9' }} />
          <Typography
            gutterBottom
            variant="h5"
            component="div"
            sx={{ marginTop: 2, marginLeft: 2 }}
          >
            {memberName}
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
            $ {Intl.NumberFormat("de-DE").format(debt.amount)}
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
          sx={{ marginLeft: 5 }}
        >
          <Typography
            gutterBottom
            variant="h5"
            component="div"
            sx={{ marginTop: 2, marginLeft: 2 }}
          >
            {expenseName}
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
         <Button startIcon={<PointOfSaleIcon />} variant="contained" onClick={() => console.log('pagar')}>
            Pagar
          </Button> 
        </Box>
      </Box>
    </Card>
  );
}
