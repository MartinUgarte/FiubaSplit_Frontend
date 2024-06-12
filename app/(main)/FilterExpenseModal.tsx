import { ExpenseFilters, Filters, Group, defaultExpenseFilters, expense_categories } from "app/types";
import {
    Box,
    Typography,
    Button,
    SelectChangeEvent,
    TextField,
    Select,
    MenuItem,
    InputAdornment,
    ThemeProvider,
} from "@mui/material";
import Modal from "@mui/material/Modal";
import { Dispatch, SetStateAction, useEffect } from "react";
import { modalTheme } from "../fonts";

const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "30%",
    height: '60%',
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 10,
};

type FilterExpenseModalProps = {
    groups: Group[];
    open: boolean;
    onClose: () => void;
    submitFilters: () => void;
    selectedFilters: ExpenseFilters;
    setSelectedFilters: Dispatch<SetStateAction<ExpenseFilters>>;
    filterByGroup: string;
};

export default function FilterExpenseModal({
    groups,
    open,
    onClose,
    selectedFilters,
    setSelectedFilters,
    submitFilters,
    filterByGroup
}: FilterExpenseModalProps) {

    useEffect(() => {
        if (open) {
            setSelectedFilters(defaultExpenseFilters)
        }
    }, [open]);

    return (
        <Modal open={open} onClose={() => onClose()}>
            <Box
                component="form"
                display="flex"
                flex="1"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                sx={style}
            >
                <Box
                    display="flex"
                    flex="0.2"
                    flexDirection="column"
                    width="100%"
                    height="100%"
                    justifyContent="center"
                    alignItems="center"
                    sx={{ backgroundColor: "#5c93c4" }}
                >
                    <ThemeProvider theme={modalTheme}>
                        <Typography color='white'>Filtrar Gastos</Typography>
                    </ThemeProvider>
                </Box>
                <Box
                    display="flex"
                    flexDirection="column"
                    flex="0.8"
                    justifyContent="center"
                    alignItems="center"
                >
                    <TextField
                        fullWidth
                        label="Nombre de Gasto"
                        value={selectedFilters.name}
                        onChange={(expense) =>
                            setSelectedFilters((prevState) => ({
                                ...prevState,
                                name: expense.target.value as string,
                            }))
                        }
                    >
                        Nombre
                    </TextField>
                    <TextField
                        fullWidth
                        label="Descripción"
                        sx={{ marginTop: 2 }}
                        value={selectedFilters.description}
                        onChange={(expense) =>
                            setSelectedFilters((prevState) => ({
                                ...prevState,
                                description: expense.target.value as string,
                            }))
                        }
                    >
                        Descripción
                    </TextField>
                    <TextField
                        fullWidth
                        id='category-select'
                        select
                        label='Categoria'
                        onChange={(expense) => setSelectedFilters(prevState => ({ ...prevState, category: expense.target.value as string }))}
                        sx={{ marginTop: 2 }}
                    >
                        {expense_categories.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.value}
                            </MenuItem>
                        ))}
                    </TextField>
                    {filterByGroup == '' && (
                        <TextField
                            fullWidth
                            id='group-select'
                            select
                            label='Grupo'
                            onChange={(group) => setSelectedFilters(prevState => ({ ...prevState, group: group.target.value as string }))}
                            sx={{ marginTop: 2 }}
                        >
                            {groups.map((option) => (
                                <MenuItem key={option.name} value={option.id}>
                                    {option.name}
                                </MenuItem>
                            ))}
                        </TextField>
                    )}
                </Box>
                <Box
                    display="flex"
                    flex="0.2"
                    justifyContent="center"
                    alignItems="center"
                >
                    <Button
                        variant="contained"
                        sx={{ height: 40 }}
                        onClick={() => submitFilters()}
                    >
                        Aceptar
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
}
