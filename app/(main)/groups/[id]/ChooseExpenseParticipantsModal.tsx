import { Amount, Filters, Group, User, defaultAmount } from "@/app/types";
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
import ChoosePayersAmountModal from "./ChoosePayersAmountModal";
import ChooseExpensePercentagesModal from "./ChooseExpensePercentagesModal";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  height: 600,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 10,
};

type ChooseExpenseParticipantsModalProps = {
  open: boolean;
  onClose: () => void;
  group: Group;
};

type FormValues = {
  expense_amount: number;
  expense_name: string;
  payers: { [key: string]: Amount}
};

export default function ChooseExpenseParticipantsModal({
  open,
  onClose,
  group,
}: ChooseExpenseParticipantsModalProps) {
  const [expenseName, setExpenseName] = useState<string>("");
  const [expenseAmount, setExpenseAmount] = useState<number>(0);
  const [participants, setParticipants] = useState<{ [key: string]: string }>({});
  const [selectedPayers, setSelectedPayers] = useState<{ [key: string]: Amount}>({});
  const [showChoosePayersAmountModal, setShowChoosePayersAmountModal] =
    useState<boolean>(false);
  const [selectedPayersNames, setSelectedPayersNames] = useState<string[]>([]); 
  const [
    showChooseExpensePercentagesModal,
    setShowChooseExpensePercentagesModal,
  ] = useState<boolean>(false);

  const form = useForm<FormValues>({
    defaultValues: {
      expense_amount: 0,
      expense_name: "",
    },
  });

  const { register, watch, handleSubmit, formState } = form;
  const { errors } = formState;

  const expense_amount = watch("expense_amount");

  const handleAddPayers = () => {
    selectedPayersNames.map(name => {
      const id = participants[name]

      setSelectedPayers(prevPayers => ({
        ...prevPayers,
        [id]: defaultAmount
      }));
    })

  };

  const handleAddParticipant = (key: string, name: string) => {
    setParticipants(prevParticipants => ({
      ...prevParticipants,
      [key]: name
    }));
  };

  const createExpense = () => {
    console.log('expense payers: ', selectedPayers);
    const jwt = localStorage.getItem("jwtToken");
    return fetch(`http://localhost:8000/expenses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({
        group_id: group.id,
        name: expenseName,
        amount: expenseAmount,
        payers: selectedPayers
        
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((data) => {
        console.log(data)
      })
  };

  const getUser = (memberId: string) => {
    const jwt = localStorage.getItem("jwtToken");
    if (!jwt) {
      return Promise.reject(new Error("JWT not found"));
    }
    return fetch(`http://localhost:8000/users/${memberId}`, {
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
      .then((data) => data)
      .catch((error) => {
        console.error("Error fetching user:", error);
        return null;
      });
  };

  const fetchUsers = () => {
    Promise.all(group.members.map((id) => getUser(id)))
      .then(users => {
        users.map((user: User) => {
          //handleAddPayer(user.id, defaultAmount) 
          handleAddParticipant(user.name, user.id)
        })
      })
      .catch((error) => {
        console.error("Error fetching users: ", error);
      });
  };

  useEffect(() => {
    if (open) {
      fetchUsers();
    }
  }, [open]);

  const handleNewExpense = (formData: FormValues) => {
    handleAddPayers()
    setExpenseName(formData.expense_name)
    setExpenseAmount(formData.expense_amount)
    setShowChoosePayersAmountModal(true);
  };

  const closeAllModals = () => {
    setShowChoosePayersAmountModal(false);
    setShowChooseExpensePercentagesModal(false);
    onClose();
  };

  return (
    <Modal open={open} onClose={() => onClose()}>
      <Box
        component="form"
        onSubmit={handleSubmit(handleNewExpense)}
        display="flex"
        flex="1"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        sx={style}
      >
        <ChoosePayersAmountModal
          setShowChooseExpensePercentagesModal={() =>
            setShowChooseExpensePercentagesModal(true)
          }
          open={showChoosePayersAmountModal}
          total_amount={expense_amount}
          onClose={() => setShowChoosePayersAmountModal(false)}
          selectedPayers={selectedPayers}
          selectedPayersNames={selectedPayersNames}
          participants={participants}
          setSelectedPayers={setSelectedPayers}
        />
        <ChooseExpensePercentagesModal
          open={showChooseExpensePercentagesModal}
          onClose={() => setShowChooseExpensePercentagesModal(false)}
          selectedPayers={selectedPayers}
          selectedPayersNames={selectedPayersNames}
          participants={participants}
          setSelectedPayers={setSelectedPayers}
          closeAllModals={() => closeAllModals()}
          createExpense={createExpense}
        />
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
          <Typography color="white">Crear Gasto</Typography>
        </Box>
        <Box
          display="flex"
          flexDirection="column"
          flex="0.8"
          justifyContent="center"
          alignItems="center"
          width="80%"
          height="80%"
        >
          <TextField
            fullWidth
            sx={{ marginTop: 2 }}
            label="Nombre"
            {...register("expense_name", {
              required: "Ingresa el nombre del gasto",
            })}
            error={!!errors.expense_name}
            helperText={errors.expense_name?.message}
          >
            Nombre
          </TextField>
          <TextField
            fullWidth
            type="number"
            sx={{ marginTop: 2 }}
            label="Monto"
            {...register("expense_amount", {
              required: "Ingrese un monto",
            })}
            error={!!errors.expense_amount}
            helperText={errors.expense_amount?.message}
          >
            Monto
          </TextField>
          <MultiSelect
            selectedPayersNames={selectedPayersNames}
            setSelectedPayersNames={(payers: string[]) => setSelectedPayersNames(payers)}
            names={Object.keys(participants)}
            text={"Pagadores"}
          />
        </Box>
        <Box
          display="flex"
          flex="0.2"
          justifyContent="center"
          alignItems="center"
        >
          <Button variant="contained" sx={{ height: 40 }} type="submit">
            Continuar
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
