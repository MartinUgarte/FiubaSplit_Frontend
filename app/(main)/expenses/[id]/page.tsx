"use client";

import { Box, IconButton, Divider, TextField, Typography, Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import IconTextRow from "../../IconTextRow";
import LoadingModal from "@/app/LoadingModal";
import { User, dumpExpense, dumpUser } from "@/app/types";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import GroupsIcon from '@mui/icons-material/Groups';
import ParticipantCard from "./ParticipantCard";
import CategoryIcon from '@mui/icons-material/Category';


export default function Expense() {
  const [expense, setExpense] = useState(dumpExpense);
  const [showLoading, setShowLoading] = useState(false);
  const [members, setMembers] = useState<{[key: string]: string}>({}) // Key: userId, Value: userName
  const [balances, setBalances] = useState<{[key: string]: {[key: string]: number}}>({})
  const [group, setGroup] = useState<string>('');
  const [barrier, setBarrier] = useState<boolean>(false);

  const formatDate = (date: Date) => {
    return `${date.getDate().toString()}/${
      date.getMonth() + 1
    }/${date.getFullYear()}`;
  };

  const handleAddMember = (key: string, name: string) => {
    console.log('El nombre que llega es: ', name)
    setMembers((prevMembers) => ({
      ...prevMembers,
      [key]: name,
    }));
  };

    const getExpense = () => {
      const jwt = localStorage.getItem("jwtToken");
      const expenseId = localStorage.getItem('expenseId')
      fetch(`http://localhost:8000/expenses/${expenseId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
      })
        .then((res) => {
          console.log(res);
          if (res.status == 200) {
            setShowLoading(false);
          }
          return res.json();
        })
        .then((data) => {
          if (data.id) {
            setExpense(data);
            setBalances(data.balances)
            getGroup(data.group_id)
            setBarrier(true)
          }
        });
    };

    const getUser = (memberId: string) => {
      const jwt = localStorage.getItem("jwtToken");
      if (!jwt) {
        return Promise.reject(new Error("JWT not found"));
      }
      return fetch(`http://localhost:8000/users/${memberId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
      })
        .then((res) => {
          console.log("El res es: ", res);
          if (!res.ok) {
            throw new Error("Network response was not ok");
          }
          return res.json();
        })
        .then((data) => data)
        .catch((error) => {
          console.error("Error fetching user:", error);
          return null;
        });
    };
  
  
  const getGroup = (groupId: string) => {
    const jwt = localStorage.getItem("jwtToken");

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
        return res.json();
      })
      .then((data) => {
        console.log("Got event: ", data);
        setGroup(data.name);
        setShowLoading(false);
      });
  };

  useEffect(() => {
    getExpense();
  }, []);

  useEffect(() => {
    if(barrier) {
      Promise.all(Object.keys(balances).map((id) => getUser(id)))
      .then((users) => {
        users.map((user: User) => {
            handleAddMember(user.id, user.name);
        });
      })
      .catch((error) => {
        console.error("Error fetching users: ", error);
      });
    }
    console.log("Quedaron los members: ", members)
  }, [barrier])
  
  const getUserBalance = (balance: {[key: string]: number}) => {
    return Object.values(balance).reduce((acum, currVal) => acum + currVal, 0);
  };

  const checkBalance = (memberId: string, balance: {[key: string]: number}) => {
    const userBalance = getUserBalance(balance)
    if (userBalance != 0) {
      return <ParticipantCard memberId={memberId} balance={balance} members={members} />
    }
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
      <Box
        sx={{ marginTop: 5 }}
        flex="0.2"
        display="flex"
        width="100%"
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Typography sx={{ marginLeft: 4, marginBottom: 2 }} variant="h3">
          {expense.name}
        </Typography>
      </Box>

      <Divider sx={{ borderBottomWidth: 2 }} />
      <Box
        sx={{ marginBottom: 2, marginTop: 3 }}
        display="flex"
        flexDirection="column"
        flex="0.3"
        width="100%"
      >
        <IconTextRow icon={<GroupsIcon />} text={group} />
        <IconTextRow icon={<TextSnippetIcon />} text={expense.description} />
        <IconTextRow icon={<AttachMoneyIcon />} text={expense.amount.toString()} />
        <IconTextRow icon={<CategoryIcon />} text={expense.category} />
        <IconTextRow
          icon={<CalendarMonthIcon />}
          text={formatDate(new Date(expense.created_date))}
        />
        
       </Box>
       <Box sx={{width:"100%"}} display="flex" flex="0.5" flexDirection="column">
        <Grid container spacing={5} sx={{ marginTop: 1 }}>
          {Object.entries(balances).map(
            ([memberId, balance]) =>
                <Grid item xs={12} key={memberId}>
                  {checkBalance(memberId, balance)}
                </Grid>
          )}
        </Grid>
      </Box> 
    </Box>
  );
}
