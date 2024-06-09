import { modalTheme } from "@/app/fonts";
import {
  DebtFilters,
  Group,
  debt_orders,
  defaultDebtFilters,
} from "@/app/types";
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

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: '30%',
  height: '50%',
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 10,
};

type FilterDebtModalProps = {
  groups: Group[];
  open: boolean;
  onClose: () => void;
  submitFilters: () => void;
  selectedFilters: DebtFilters;
  setSelectedFilters: Dispatch<SetStateAction<DebtFilters>>;
};

export default function FilterDebtModal({
  open,
  onClose,
  selectedFilters,
  setSelectedFilters,
  submitFilters,
  groups,
}: FilterDebtModalProps) {
  useEffect(() => {
    if (open) {
      setSelectedFilters(defaultDebtFilters);
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
          sx={{ backgroundColor: "blue" }}
        >
          <ThemeProvider theme={modalTheme}>
            <Typography color="white">Filtrar Deudas</Typography>
          </ThemeProvider>
        </Box>
        <Box
          display="flex"
          flexDirection="column"
          flex="0.8"
          width='80%'
          justifyContent="center"
          alignItems="center"
        >
          <TextField
            fullWidth
            id="group-select"
            select
            label="Grupo"
            onChange={(group) =>
              setSelectedFilters((prevState) => ({
                ...prevState,
                group: group.target.value as string,
              }))
            }
            sx={{ marginTop: 2 }}
          >
            {groups.map((option) => (
              <MenuItem key={option.name} value={option.id}>
                {option.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            fullWidth
            id="order-select"
            select
            label="Ordenar por monto"
            onChange={(group) =>
              setSelectedFilters((prevState) => ({
                ...prevState,
                order: group.target.value as string,
              }))
            }
            sx={{ marginTop: 2 }}
          >
            {debt_orders.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
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
            sx={{ height: 40, mb: '5%' }}
            onClick={() => submitFilters()}
          >
            Aceptar
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
