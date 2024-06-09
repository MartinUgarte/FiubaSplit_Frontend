"use client";

import {
  Box,
  IconButton,
  Divider,
  TextField,
  Typography,
  Button,
  Grid,
  ThemeProvider,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import LoadingModal from "@/app/LoadingModal";
import { Expense, ExpenseFilters, dumpGroup, dumpUser, defaultExpenseFilters } from "@/app/types";
import CategoryIcon from '@mui/icons-material/Category';
import DescriptionIcon from '@mui/icons-material/Description';
import IconTextRow from "../../IconTextRow";
import InvitationModal from "./InvitationModal";
import MembersModal from "./MembersModal";
import ChooseExpenseParticipantsModal from "./ChooseExpenseParticipantsModal";
import ExpenseCard from "../../ExpenseCard";
import FilterExpenseModal from "../../FilterExpenseModal";
import { subheaderTheme } from "@/app/fonts";
import AddIcon from '@mui/icons-material/Add';
import FilterAltIcon from '@mui/icons-material/FilterAlt';

export default function GroupDetails() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [group, setGroup] = useState(dumpGroup);
  const [showEditGroupModal, setShowEditGroupModal] = useState(false);
  //const [showLoading, setShowLoading] = useState(false);
  const [showInvitationModal, setShowInvitationModal] = useState(false);
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [showNewExpenseModal, setShowNewExpenseModal] = useState(false);
  const [showFilterExpensesModal, setShowFilterExpensesModal] = useState(false);
  const [selectedExpensesFilters, setSelectedExpensesFilters] = useState<ExpenseFilters>(defaultExpenseFilters);

  const formatDate = (date: Date) => {
    return `${date.getDate().toString()}/${
      date.getMonth() + 1
    }/${date.getFullYear()}`;
  };

  const getGroup = () => {
    const jwt = localStorage.getItem("jwtToken");
    const groupId = localStorage.getItem("groupId");
    
    if (!jwt || !groupId) {
      return;
    }
    // setShowLoading(true);
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
        setGroup(data);
        // setShowLoading(false);
      });
  };

  useEffect(() => {
      console.log('Use effect por pagina')
      setSelectedExpensesFilters(defaultExpenseFilters)
      getGroup();
  }, []);

  const getExpenses = () => {
    const jwt = localStorage.getItem("jwtToken");
    const groupId = localStorage.getItem("groupId");

    if (!jwt || !groupId) {
      return;
    }
    //setShowLoading(true);

    const groupParam = groupId;
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
              id: expense.id,
              description: expense.description,
              creator_id: expense.creator_id,
              category: expense.category
            };
          }))
          
        //setShowLoading(false);
      });
  };

  const submitFilters = () => {
    console.log('FILTROS SELECCIONAOS: ', selectedExpensesFilters);
    setSelectedExpensesFilters(selectedExpensesFilters);
    getExpenses();
    setShowFilterExpensesModal(false);
  };
  
  useEffect(() => {
    console.log('Dpues de cambiar group')
    setSelectedExpensesFilters(defaultExpenseFilters)
    getExpenses();
}, [group]);

  const checkAdmin = () => {
    return localStorage.getItem('userId') == group.creator_id
  }

  return (
    <Box
      display="flex"
      flex="1"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
    >
      {/* <LoadingModal open={showLoading} onClose={() => setShowLoading(false)} /> */}
      <InvitationModal open={showInvitationModal} onClose={() => setShowInvitationModal(false)} />
      <ChooseExpenseParticipantsModal group={group} open={showNewExpenseModal} onClose={() => setShowNewExpenseModal(false)} getExpenses={() => getExpenses()}/>
      <MembersModal open={showMembersModal} onClose={() => setShowMembersModal(false)} group={group} getGroup={() => getGroup()}/>
      <FilterExpenseModal
      groups={[]}
        open={showFilterExpensesModal}
        onClose={() => setShowFilterExpensesModal(false)}
        selectedFilters={selectedExpensesFilters}
        setSelectedFilters={setSelectedExpensesFilters}
        submitFilters={() => submitFilters()}
        filterByGroup={group.id}
      />
      <Box  
        flex="0.2"
        display="flex"
        width="100%"
        flexDirection="row"
        alignItems="center"
        sx={{borderBottom: '1px solid black', width: '100%'}}
      >
        <Box
          flex="0.5"
          display='flex'
          flexDirection="row"
          justifyContent="flex-start"
          alignItems="center"
          sx={{height: '100%', width: '100%'}}
        >
          <ThemeProvider theme={subheaderTheme}>
          <Typography sx={{ marginLeft: 4, marginBottom: 2 }} variant="h3">
            {group.name}
          </Typography>
          </ThemeProvider>
        </Box>
        <Box
          flex="0.5"
          display='flex'
          flexDirection="row"
          justifyContent="flex-end"
          alignItems="center"
          sx={{height: '100%', width: '100%'}}
        >
          <Button startIcon={<AddIcon />} variant="contained" onClick={() => setShowNewExpenseModal(true)}>
            Gasto
          </Button>
          <Button sx={{marginLeft: 2}} variant="text" onClick={() => setShowMembersModal(true)}>
            Miembros
          </Button>
          {checkAdmin() && <Button sx={{marginLeft: 2, marginRight: 5}}variant="contained" onClick={() => setShowInvitationModal(true)}>
            Añadir miembro
          </Button>}
        </Box>
      </Box>

      <Box
        sx={{ marginBottom: 2, marginTop: 3 }}
        display="flex"
        flexDirection="column"
        flex="0.2"
        width="100%"
      >
        {group.description != "" && (<IconTextRow icon={<DescriptionIcon sx={{color: '#487ba9'}} />} text={group.description} />)}
        <IconTextRow icon={<CategoryIcon sx={{color: '#487ba9'}} />} text={group.category} />
      </Box>
      <Box sx={{width: '100%'}} display='flex' flexDirection='row' flex='0.1' alignItems='flex-start' justifyContent='space-between'>
      <ThemeProvider theme={subheaderTheme}>
        <Typography sx={{fontSize: 30, paddingRight: 10, borderBottom: '1px solid black'}}>Gastos</Typography>
      </ThemeProvider>
        <Button startIcon={<FilterAltIcon />} variant='text' onClick={() => setShowFilterExpensesModal(true)}>Filtrar</Button>
      </Box>
      <Box maxHeight='300px' sx={{ marginTop: 2, maxHeight: '300px', overflowY: 'auto' }} display="flex" flexDirection='column' flex="0.6" width='100%'>
        <Grid container spacing={5} sx={{ marginTop: 1 }}>
          {expenses.map(
            (expense) =>
              (
                <Grid item xs={12} key={expense.id}>
                  <ExpenseCard expense={expense} getExpenses={() => getExpenses()} route={'../expenses'}/>
                </Grid>
              )
          )}
        </Grid>
      </Box>
    </Box>
  );
}
