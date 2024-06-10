"use client";

import { useEffect, useState } from "react";
import { Box, Button, Grid, Typography } from "@mui/material";
import { Expense, ExpenseFilters, Group, Invitation, defaultExpenseFilters, dumpGroup, dumpInvitation } from "@/app/types";
import LoadingModal from '@/app/LoadingModal';
import ExpenseCard from "../ExpenseCard";
import FilterExpenseModal from "../FilterExpenseModal";
import { API_URL } from "@/app/constants";

export default function Expenses() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [showLoading, setShowLoading] = useState(false);
  const [showFilterExpensesModal, setShowFilterExpensesModal] = useState(false);
  const [selectedExpensesFilters, setSelectedExpensesFilters] = useState<ExpenseFilters>(defaultExpenseFilters);
  
  useEffect(() => {
    getExpenses();
  }, []);

  const getExpenses = () => {
    const jwt = localStorage.getItem("jwtToken");

    if (!jwt) {
      return;
    }
    setShowLoading(true);

    const groupParam = selectedExpensesFilters.group ? selectedExpensesFilters.group : '';
    const nameParam = selectedExpensesFilters.name ? selectedExpensesFilters.name : '';
    const descriptionParam = selectedExpensesFilters.description ? selectedExpensesFilters.description : '';
    const categoryParam = selectedExpensesFilters.category ? selectedExpensesFilters.category : '';

    const paramsArray: [string, string | undefined][] = [
      ['group_id', groupParam],
      ['name', nameParam],
      ['description', descriptionParam],
      ['category', categoryParam]
    ];

    const filteredParams = paramsArray.filter(([_, value]) => value !== '');

    const queryParams = new URLSearchParams(filteredParams as unknown as string[][]);
    console.log(queryParams)
  
    fetch(`${API_URL}/expenses?${queryParams.toString()}`, {
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
        console.log("Got expenses: ", data);
        setExpenses(
          data.map((expense: Expense) => {
            return {
              group_id: expense.group_id,
              name: expense.name,
              amount: expense.amount,
              payers: expense.payers,
              created_date: expense.created_date,
              balance: expense.balance,
              id: expense.id,
              description: expense.description,
              creator_id: expense.creator_id,
              category: expense.category
            };
          }))
          
        setShowLoading(false);
      });
  };

  const getGroups = () => {
    const jwt = localStorage.getItem("jwtToken");
    const userId = localStorage.getItem("userId");
    if (userId == null) {
      return
    }

    fetch(`${API_URL}/groups`, {
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
        console.log("Got groups: ", data);
        const myGroups = data.filter((group: Group) => group.members.includes(userId));
        setGroups(
          myGroups.map((group: Group) => {
            return {
              id: group.id,
              name: group.name,
              description: group.description,
              creator_id: group.creator_id,
              category: group.category,
              members: group.members,
            };
          })
        );
      });
  };

  useEffect(() => {
    console.log('Got my groups: ', groups)
    getGroups()
}, []);

  const submitFilters = () => {
    console.log('FILTROS SELECCIONAOS: ', selectedExpensesFilters);
    setSelectedExpensesFilters(selectedExpensesFilters);
    getExpenses();
    setShowFilterExpensesModal(false);
  };

  return (
    <Box display="flex" flex="1" flexDirection="column">
        <LoadingModal open={showLoading} onClose={() => setShowLoading(false)} />
        <FilterExpenseModal
        groups={groups}
        open={showFilterExpensesModal}
        onClose={() => setShowFilterExpensesModal(false)}
        selectedFilters={selectedExpensesFilters}
        setSelectedFilters={setSelectedExpensesFilters}
        submitFilters={() => submitFilters()}
        filterByGroup={''}
      />
        
        <Box display='flex' flex='0.2' flexDirection='row' width='100%'>
            <Button
            variant="outlined"
            sx={{ marginLeft: 2 }}
            onClick={() => setShowFilterExpensesModal(true)}
            >
            Filtros
            </Button>
        </Box>
        <Box sx={{marginLeft: 9, marginTop: 2}} flex="1" display='flex' flexDirection="row">
          <Box justifyContent='center' alignItems='center' display='flex' flex='0.25'>
            <Typography color='#487ba9' fontWeight={'bold'}>Nombre</Typography>
          </Box>
          <Box justifyContent='center' alignItems='center' display='flex' flex='0.25'>
            <Typography color='#487ba9' fontWeight={'bold'}>Monto</Typography>
          </Box>
          <Box justifyContent='center' alignItems='center' display='flex' flex='0.25'>
            <Typography color='#487ba9' fontWeight={'bold'}>Grupo</Typography>
          </Box>
          <Box justifyContent='center' alignItems='center' display='flex' flex='0.25'>
            <Typography color='#487ba9' fontWeight={'bold'}>Opciones</Typography>
          </Box>
        </Box>
        <Box maxHeight='600px' sx={{ maxHeight: '600px', overflowY: 'auto' }} display="flex" flexDirection='column' flex="0.7" width='100%'>
            <Grid container spacing={5} sx={{ marginTop: 0.3 }}>
            {expenses.map(
                (expense) =>
                (
                    <Grid item xs={12} key={expense.id}>
                        <ExpenseCard route={'expenses'} expense={expense} getExpenses={() => getExpenses()} />
                    </Grid>
                )
            )}
            </Grid>
      </Box>
    </Box>
  );
}
