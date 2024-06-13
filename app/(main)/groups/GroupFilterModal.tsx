import { modalTheme } from "app/fonts";
import { Filters } from "app/types";
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
import { Dispatch, SetStateAction } from "react";

const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    height: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 10,
};

const categories = [
    {
        value: "Amigos",
        label: "Amigos",
    },
    {
        value: "Familia",
        label: "Familia",
    },
    {
        value: "Pareja",
        label: "Pareja",
    },
    {
        value: "Entretenimiento",
        label: "Entretenimiento",
    },
    {
        value: "Viaje",
        label: "Viaje",
    },
    {
        value: "Comida",
        label: "Comida",
    },
];

type FilterGroupModalProps = {
    open: boolean;
    onClose: () => void;
    submitFilters: () => void;
    selectedFilters: Filters;
    setSelectedFilters: Dispatch<SetStateAction<Filters>>;
};

export default function FilterGroupModal({
    open,
    onClose,
    selectedFilters,
    setSelectedFilters,
    submitFilters,
}: FilterGroupModalProps) {
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
                        <Typography color="white">Filtrar grupos</Typography>
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
                        label="Nombre"
                        value={selectedFilters.name}
                        onChange={(group) =>
                            setSelectedFilters((prevState) => ({
                                ...prevState,
                                name: group.target.value as string,
                            }))
                        }
                    >
                        Nombre
                    </TextField>
                    <TextField
                        fullWidth
                        label="Descripcion"
                        value={selectedFilters.description}
                        onChange={(group) =>
                            setSelectedFilters((prevState) => ({
                                ...prevState,
                                description: group.target.value as string,
                            }))
                        }
                        sx={{ marginTop: 2 }}
                    >
                        Descripción
                    </TextField>
                    <TextField
                        fullWidth
                        id="category-select"
                        select
                        label="Categoria"
                        onChange={(group) =>
                            setSelectedFilters((prevState) => ({
                                ...prevState,
                                category: group.target.value as string,
                            }))
                        }
                        sx={{ marginTop: 2 }}
                    >
                        {categories.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.value}
                            </MenuItem>
                        ))}
                    </TextField>
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
