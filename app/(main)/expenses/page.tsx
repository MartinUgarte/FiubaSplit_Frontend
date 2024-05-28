"use client";

import { useEffect, useState } from "react";
import { Box, Button, Grid } from "@mui/material";
import { Expense, ExpenseFilters, Group, Invitation, defaultExpenseFilters, dumpGroup, dumpInvitation } from "@/app/types";
import LoadingModal from '@/app/LoadingModal';
import ExpenseCard from "../ExpenseCard";
import FilterExpenseModal from "../FilterExpenseModal";

export default function Expenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [showLoading, setShowLoading] = useState(false);
  const [showFilterExpensesModal, setShowFilterExpensesModal] = useState(false);
  const [selectedExpensesFilters, setSelectedExpensesFilters] = useState<ExpenseFilters>(defaultExpenseFilters);
  
  useEffect(() => {
    getExpenses();
  }, []);

  const getExpenses = () => {
    const jwt = localStorage.getItem("jwtToken");
    const groupId = localStorage.getItem("groupId");

    if (!jwt || !groupId) {
      return;
    }
    setShowLoading(true);

    const groupParam = groupId;
    const nameParam = selectedExpensesFilters.name ? selectedExpensesFilters.name : '';

    const paramsArray: [string, string | undefined][] = [
      ['group_id', groupParam],
      ['name', nameParam]
    ];

    const filteredParams = paramsArray.filter(([_, value]) => value !== '');

    const queryParams = new URLSearchParams(filteredParams as unknown as string[][]);
    console.log(queryParams)
  
    fetch(`http://localhost:8000/expenses?${queryParams.toString()}`, {
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
            };
          }))
          
        setShowLoading(false);
      });
  };

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
        open={showFilterExpensesModal}
        onClose={() => setShowFilterExpensesModal(false)}
        selectedFilters={selectedExpensesFilters}
        setSelectedFilters={setSelectedExpensesFilters}
        submitFilters={() => submitFilters()}
      />
        
        <Box display='flex' flex='0.2' flexDirection='row' width='100%'>
            <Button
            variant="outlined"
            sx={{ height: 40, marginLeft: 2 }}
            onClick={() => setShowFilterExpensesModal(true)}
            >
            Filtros
            </Button>
        </Box>
        <Box maxHeight='600px' sx={{ maxHeight: '600px', overflowY: 'auto' }} display="flex" flexDirection='column' flex="0.8" width='100%'>
            <Grid container spacing={5} sx={{ marginTop: 1 }}>
            {expenses.map(
                (expense) =>
                (
                    <Grid item xs={12} key={expense.id}>
                        <ExpenseCard expense={expense} getExpenses={() => getExpenses()} />
                    </Grid>
                )
            )}
            </Grid>
      </Box>
    </Box>
  );
}
