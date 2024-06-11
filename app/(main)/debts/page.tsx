"use client";

import { useContext, useEffect, useState } from "react";
import { Box, Button, Grid, IconButton, Typography } from "@mui/material";
import { Debt, DebtFilters, Expense, ExpenseFilters, Group, Invitation, defaultDebtFilters, dumpGroup, dumpInvitation } from "app/types";
import LoadingModal from 'app/LoadingModal';
import ExpenseCard from "../ExpenseCard";
import FilterExpenseModal from "../FilterExpenseModal";
import DebtCard from "./DebtCard";
import FilterDebtModal from "./FilterDebtModal.";
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { API_URL } from "app/constants";

export default function Debts() {
    const [groups, setGroups] = useState<Group[]>([]);
    const [debts, setDebts] = useState<Debt[]>([]);
    // const [showLoading, setShowLoading] = useState(false);
    const [totalDebt, setTotalDebt] = useState(0);
    const [showFilterDebtsModal, setShowFilterDebtsModal] = useState(false);
    const [selectedDebtsFilters, setSelectedDebtFilters] = useState<DebtFilters>(defaultDebtFilters);

    useEffect(() => {
        getDebts();
    }, []);

    const getDebts = () => {
        setDebts([])
        const jwt = localStorage.getItem("jwtToken");

        if (!jwt) {
            return;
        }
        //setShowLoading(true);

        const groupParam = selectedDebtsFilters.group ? selectedDebtsFilters.group : '';
        const orderParam = selectedDebtsFilters.order ? selectedDebtsFilters.order : '';

        const paramsArray: [string, string | undefined][] = [
            ['group_id', groupParam],
            ['order', orderParam],
        ];

        const filteredParams = paramsArray.filter(([_, value]) => value !== '');

        const queryParams = new URLSearchParams(filteredParams as unknown as string[][]);
        console.log('queryParams: ', queryParams.toString())

        fetch(`${API_URL}/debts?${queryParams.toString()}`, {
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
                console.log("Got debts: ", data);
                setDebts(
                    data.debts.map((debt: Debt) => {
                        return {
                            group_id: debt.group_id,
                            user_to_pay: debt.user_to_pay,
                            expense_id: debt.expense_id,
                            amount: debt.amount,
                        };
                    }))
                setTotalDebt(data.total_debt)
                //setShowLoading(false);
            });
    };

    useEffect(() => {
        console.log('Got my groups: ', groups)
        getGroups()
    }, []);

    useEffect(() => {
        console.log('Debts changed: ', debts)
    }, [debts])

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

    const submitFilters = () => {
        console.log('FILTROS SELECCIONAOS: ', selectedDebtsFilters);
        setSelectedDebtFilters(selectedDebtsFilters);
        getDebts();
        setShowFilterDebtsModal(false);
    };

    const getAllDebts = () => {
        setSelectedDebtFilters(defaultDebtFilters)
        //getDebts()
    }

    useEffect(() => {
        if (showFilterDebtsModal == false) {
            getDebts()
        }
    }, [selectedDebtsFilters]);

    return (
        <Box display="flex" flex="1" flexDirection="column">
            {/* <LoadingModal open={showLoading} onClose={() => setShowLoading(false)} /> */}
            <FilterDebtModal
                groups={groups}
                open={showFilterDebtsModal}
                onClose={() => setShowFilterDebtsModal(false)}
                selectedFilters={selectedDebtsFilters}
                setSelectedFilters={setSelectedDebtFilters}
                submitFilters={() => submitFilters()}

            />
            <Box display='flex' flex='0.2' justifyContent='space-between' flexDirection='row' width='100%'>
                <Box display='flex' flexDirection='row'>
                    <Button
                        variant="outlined"
                        sx={{ marginLeft: 2 }}
                        onClick={() => setShowFilterDebtsModal(true)}
                    >
                        Filtros
                    </Button>

                    <IconButton color="primary" onClick={() => getAllDebts()} sx={{ ml: 1 }}>
                        <RestartAltIcon />
                    </IconButton>

                </Box>

                <Box display='flex' flexDirection='row'>
                    <Typography sx={{ fontSize: 25, marginRight: 3 }}>En total debes</Typography>
                    <Typography sx={{ fontSize: 25, color: 'red', marginRight: 2 }}>${totalDebt.toFixed(2)}</Typography>
                </Box>
            </Box>

            <Box sx={{ marginLeft: 5, marginTop: 2 }} flex="1" display='flex' flexDirection="row">
                <Box justifyContent='center' alignItems='center' display='flex' flex='0.20'>
                    <Typography color='#487ba9' fontWeight={'bold'}>Nombre</Typography>
                </Box>
                <Box justifyContent='center' alignItems='center' display='flex' flex='0.20'>
                    <Typography color='#487ba9' fontWeight={'bold'}>Monto</Typography>
                </Box>
                <Box justifyContent='center' alignItems='center' display='flex' flex='0.20'>
                    <Typography color='#487ba9' fontWeight={'bold'}>Grupo</Typography>
                </Box>
                <Box justifyContent='center' alignItems='center' display='flex' flex='0.20'>
                    <Typography color='#487ba9' fontWeight={'bold'}>Gasto</Typography>
                </Box>
                <Box justifyContent='center' alignItems='center' display='flex' flex='0.20'>

                </Box>
            </Box>

            <Box maxHeight='600px' sx={{ maxHeight: '600px', overflowY: 'auto' }} display="flex" flexDirection='column' flex="0.7" width='100%'>
                <Grid container spacing={5} sx={{ marginTop: 0.3 }}>
                    {debts.map(
                        (debt, index) =>
                        (
                            <Grid item xs={12} key={index}>
                                <DebtCard debt={debt} getDebts={() => getDebts()} getLayoutDebts={() => getDebts()} />
                            </Grid>
                        )
                    )}
                </Grid>
            </Box>
        </Box>
    );
}
