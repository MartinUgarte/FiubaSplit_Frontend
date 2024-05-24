import { Filters, Group } from "@/app/types";
import {
  Box,
  Typography,
  Button,
  SelectChangeEvent,
  TextField,
  Select,
  MenuItem,
  InputAdornment,
} from "@mui/material";
import Modal from "@mui/material/Modal";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import MultiSelect from "./MultiSelect";
import { useForm } from "react-hook-form";

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

type ChoosePayersAmountModalProps = {
  open: boolean;
  onClose: () => void;
  selectedPayers: string[];
  setShowChooseExpensePercentagesModal: () => void;
};

type FormValues = {
  amount: string;
  name: string;
};

export default function ChoosePayersAmountModal({
  open,
  onClose,
  selectedPayers,
  setShowChooseExpensePercentagesModal,
}: ChoosePayersAmountModalProps) {
  const form = useForm<FormValues>({
    defaultValues: {
      name: "",
    },
  });

  const { register, handleSubmit, formState } = form;
  const { errors } = formState;

  const handleNewExpense = (formData: FormValues) => {
    setShowChooseExpensePercentagesModal()
}

  return (
    <Modal open={open} onClose={() => onClose()}>
      <Box
        display="flex"
        flex="1"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        sx={style}
        component="form" 
        onSubmit={handleSubmit(handleNewExpense)}
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
          <Typography color="white">Asignar montos</Typography>
        </Box>
        <Box
          display="flex"
          flexDirection="column"
          flex="0.8"
          justifyContent="center"
          alignItems="center"
          width="80%"
        >
          {selectedPayers.map((payer) => (
            <TextField
              key={payer}
              fullWidth
              sx={{ marginTop: 2 }}
              label={payer}
              {...register("name", {
                required: "Ingresa el monto",
              })}
              error={!!errors.name}
              helperText={errors.amount?.message}
            >
              Nombre
            </TextField>
          ))}
        </Box>
        <Box
          display="flex"
          flex="0.2"
          justifyContent="space-around"
          alignItems="center"
          flexDirection='row'
          width='80%'
        >
          <Button
            variant="contained"
            sx={{ height: 40 }}
            onClick={() => onClose()}
          >
            Atras
          </Button>  
          <Button
            variant="contained"
            sx={{ height: 40 }}
            type='submit'
          >
            Continuar
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
