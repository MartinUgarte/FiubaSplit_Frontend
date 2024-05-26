import { Amount, Filters, Group, defaultAmount } from "@/app/types";
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
import { useForm, useFieldArray } from "react-hook-form";
import CustomModal from "@/app/CustomModal";

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
  selectedPayers: { [key: string]: Amount};
  selectedPayersNames: string[];
  total_amount: number;
  participants: { [key: string]: string};
  setSelectedPayers: Dispatch<SetStateAction<{ [key: string]: Amount }>>;
  setShowChooseExpensePercentagesModal: () => void;
};

type FormValues = {
  payers: { name: string, amount: string }[]
}

export default function ChoosePayersAmountModal({
  open,
  onClose,
  selectedPayers,
  selectedPayersNames,
  total_amount,
  participants,
  setSelectedPayers,
  setShowChooseExpensePercentagesModal,
}: ChoosePayersAmountModalProps) {
  const [showErrorModal, setShowErrorModal] = useState(false);

  const form = useForm<FormValues>({
    defaultValues: {
      payers: selectedPayersNames.map(name => ({ name, amount: '' }))
    },
  });

  const { register, handleSubmit, formState: { errors }, control } = form;
  const { fields } = useFieldArray({
    control,
    name: "payers"
  });

  const handleNewExpense = (formData: FormValues) => {
    const totalAmount = formData.payers.reduce((acc, current) => {
      const amount = parseFloat(current.amount);
      return acc + (isNaN(amount) ? 0 : amount); 
    }, 0);
  
    if (totalAmount != total_amount) {
      setShowErrorModal(true)
      return; 
    }

    formData.payers.map((payer) => {
      const userId = participants[payer.name]
        
        setSelectedPayers(prevPayers => ({
          ...prevPayers,
          [userId]: {amount: Number(payer.amount), percentage: 0}
        }));
      
    })

    console.log("Payer modificado es:. ", selectedPayers)

    setShowChooseExpensePercentagesModal()
}

useEffect(() => {
  if (selectedPayersNames.length > 0) {
    form.reset({
      payers: selectedPayersNames.map(name => ({ name, amount: '' }))
    });
  }
}, [selectedPayersNames, form]);

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
      <CustomModal open={showErrorModal} onClick={() => setShowErrorModal(false)} onClose={() => setShowErrorModal(false)} text={"El monto debe ser " + total_amount.toString()} buttonText='Close'/>

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
          {fields.map((field, index) => (
            <TextField
              key={field.id}
              fullWidth
              sx={{ marginTop: 2 }}
              label={`Monto para ${field.name}`}
              {...register(`payers.${index}.amount`, {
                required: "Ingresa el monto",
              })}
              error={!!errors.payers?.[index]?.amount}
              helperText={errors.payers?.[index]?.amount?.message}
            />
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
