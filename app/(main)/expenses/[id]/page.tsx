"use client";

import { Box, IconButton, Divider, TextField, Typography, Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import IconTextRow from "../../IconTextRow";
import LoadingModal from "@/app/LoadingModal";
import { dumpExpense, dumpUser } from "@/app/types";
import EmailIcon from "@mui/icons-material/Email";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import CakeIcon from "@mui/icons-material/Cake";
import PersonIcon from "@mui/icons-material/Person";
import EditIcon from "@mui/icons-material/Edit";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import GroupsIcon from '@mui/icons-material/Groups';
import ParticipantCard from "./ParticipantCard";

export default function Expense() {
  const [expense, setExpense] = useState(dumpExpense);
  const [showLoading, setShowLoading] = useState(false);
  const [members, setMembers] = useState<string[]>([''])
  const [group, setGroup] = useState<string>('')

  const formatDate = (date: Date) => {
    return `${date.getDate().toString()}/${
      date.getMonth() + 1
    }/${date.getFullYear()}`;
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
          console.log("LA EXPENSE: ", data);
          if (data.id) {
            setExpense(data);
            console.log("El expense es: ", expense);

            setMembers(Object.keys(data.balance).map((memberId: string) => {
                return getUser(memberId)
            }))

            getGroup(data.group_id)
            
          }
        });
    };

  const getUser = (userId: string) => {
    const jwt = localStorage.getItem("jwtToken");
    fetch(`http://localhost:8000/users/${userId}`, {
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
        console.log("La data: ", data);
        if (data.id) {
          return data.name
        }
      });
      return ''
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
        flex="0.8"
        width="100%"
      >
        <IconTextRow icon={<GroupsIcon />} text={group} />
        <IconTextRow icon={<TextSnippetIcon />} text={expense.description} />
        <IconTextRow icon={<AttachMoneyIcon />} text={expense.amount.toString()} />
        <IconTextRow
          icon={<CalendarMonthIcon />}
          text={formatDate(new Date(expense.created_date))}
        />
        
       </Box>
      {/*<Box display="flex" flex="0.9">
        <Grid container spacing={5} sx={{ marginTop: 1 }}>
          {members.map(
            (member) =>
                <Grid item xs={6} key={group.id}>
                  <ParticipantCard group={group} getGroups={() => getGroups()} />
                </Grid>
          )}
        </Grid>
      </Box> */}
    </Box>
  );
}
