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

type ChooseExpensePercentagesAmountModalProps = {
  open: boolean;
  onClose: () => void;
  selectedPayers: { [key: string]: Amount};
  selectedPayersNames: string[];
  participants: { [key: string]: string};
  setSelectedPayers: Dispatch<SetStateAction<{ [key: string]: Amount }>>;
  closeAllModals: () => void;
  createExpense: () => void;
};

type FormValues = {
  payers: { name: string, percentage: string }[]
}

export default function ChooseExpensePercentagesAmountModal({
  open,
  onClose,
  selectedPayers,
  selectedPayersNames,
  participants,
  setSelectedPayers,
  closeAllModals,
  createExpense,
}: ChooseExpensePercentagesAmountModalProps) {
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [readyToGo, setReadyToGo] = useState(false);

  const form = useForm<FormValues>({
    defaultValues: {
      payers: Object.keys(participants).map(name => ({ name, percentage: '' }))
    },
  });

  const { register, handleSubmit, formState: { errors }, control } = form;
  const { fields } = useFieldArray({
    control,
    name: "payers"
  });

  const handleNewExpense = (formData: FormValues) => {
    const totalPercentage = formData.payers.reduce((acc, current) => {
      const percentage = parseFloat(current.percentage);
      return acc + (isNaN(percentage) ? 0 : percentage); 
    }, 0);

    if (totalPercentage != 100) {
      setShowErrorModal(true)
      return; 
    }

    formData.payers.map((payer) => {
      const userId = participants[payer.name]
      const userAmount = selectedPayers[userId].amount

        setSelectedPayers(prevPayers => ({
          ...prevPayers,
          [userId]: {amount: userAmount, percentage: Number(payer.percentage) / 100}
        }));
      
    })

    setReadyToGo(true)
}

useEffect(() => {
  if (readyToGo) {
    setReadyToGo(false)
    createExpense()
    closeAllModals()
  }
}, [readyToGo])

useEffect(() => {
  if (Object.keys(participants).length > 0) {
    form.reset({
      payers: Object.keys(participants).map(name => ({ name, percentage: '' }))
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
      <CustomModal open={showErrorModal} onClick={() => setShowErrorModal(false)} onClose={() => setShowErrorModal(false)} text={"La suma de los porcentajes debe sumar 100"} buttonText='Close'/>

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
          <Typography color="white">Asignar porcentajes</Typography>
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
              label={`Porcentaje para ${field.name}`}
              {...register(`payers.${index}.percentage`, {
                required: "Ingresa el porcentaje",
              })}
              error={!!errors.payers?.[index]?.percentage}
              helperText={errors.payers?.[index]?.percentage?.message}
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
