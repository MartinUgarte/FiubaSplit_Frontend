import {
  Amount,
  Filters,
  Group,
  User,
  defaultAmount,
  expense_categories,
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
} from "@mui/material";
import Modal from "@mui/material/Modal";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import MultiSelect from "./MultiSelect";
import { useForm } from "react-hook-form";
import ChoosePayersAmountModal from "./ChoosePayersAmountModal";
import ChooseExpensePercentagesModal from "./ChooseExpensePercentagesModal";
import CustomModal from "@/app/CustomModal";

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
  getExpenses: () => void;
};

type FormValues = {
  expense_amount: number;
  expense_name: string;
  payers: { [key: string]: Amount };
  expense_description: string;
  expense_category: string;
};

export default function ChooseExpenseParticipantsModal({
  open,
  onClose,
  group,
  getExpenses,
}: ChooseExpenseParticipantsModalProps) {
  const [expenseName, setExpenseName] = useState<string>("");
  const [expenseAmount, setExpenseAmount] = useState<number>(0);
  const [expenseDescription, setExpenseDescription] = useState<string>("");
  const [expenseCategory, setExpenseCategory] = useState<string>("");
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [continueButtonPressed, setContinueButtonPressed] = useState<boolean>(false);
  const [participants, setParticipants] = useState<{ [key: string]: string }>(
    {}
  );
  const [selectedPayers, setSelectedPayers] = useState<{
    [key: string]: Amount;
  }>({});
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
      expense_description: "",
      expense_category: "",
    },
  });

  const { register, watch, handleSubmit, formState, reset } = form;
  const { errors } = formState;
  
  const expense_amount = watch("expense_amount");

  const handleAddPayers = () => {
    selectedPayersNames.map((name) => {
      const id = participants[name];

      setSelectedPayers((prevPayers) => ({
        ...prevPayers,
        [id]: defaultAmount,
      }));
    });
  };

  const resetContext = () => {
    setSelectedPayersNames([])
    setSelectedPayers({})
  }

  const handleAddParticipant = (key: string, name: string) => {
    setParticipants((prevParticipants) => ({
      ...prevParticipants,
      [key]: name,
    }));
    console.log("Se llenaron todos los participants y quedo: ", participants)
  };

  const createExpense = () => {
    console.log("Creando gasto con: ", selectedPayers);
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
        payers: selectedPayers,
        description: expenseDescription,
        category: expenseCategory,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((data) => {
        console.log(data);
        getExpenses();
        resetContext()
      });
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
        console.log("El res es: ", res);
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
      .then((users) => {
        users.map((user: User) => {
          //handleAddPayer(user.id, defaultAmount)
          handleAddParticipant(user.name, user.id);
        });
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

  const openChoosePayersAmountModal = (formData: FormValues) => {
    setContinueButtonPressed(true)
    if (selectedPayersNames.length == 0) {
      return
    }
    handleAddPayers();
    setExpenseName(formData.expense_name);
    setExpenseAmount(formData.expense_amount);
    setExpenseDescription(formData.expense_description);
    setExpenseCategory(formData.expense_category);
    setShowChoosePayersAmountModal(true);
  };

  const closeAllModals = () => {
    setShowChoosePayersAmountModal(false);
    setShowChooseExpensePercentagesModal(false);
    onClose();
  };

  return (
    <Modal open={open} onClose={() => onClose()}>
      <>
        <ChoosePayersAmountModal
          setShowChooseExpensePercentagesModal={() =>
            setShowChooseExpensePercentagesModal(true)
          }
          open={showChoosePayersAmountModal}
          total_amount={expense_amount}
          onClose={() => setShowChoosePayersAmountModal(false)}
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
          <CustomModal
          open={showErrorModal}
          onClick={() => setShowErrorModal(false)}
          onClose={() => setShowErrorModal(false)}
          text="Se debe elegir al menos un pagador"
          buttonText="Ok"
        />
        <Box
          component="form"
          onSubmit={handleSubmit(openChoosePayersAmountModal)}
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
            <Typography color="white" sx={{fontSize:30}}>Crear Gasto</Typography>
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
                validate: value =>
                  value > 1 || "El monto debe ser mayor a 1"                
              })}
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
              error={!!errors.expense_amount}
              helperText={errors.expense_amount?.message}
            >
              Monto
            </TextField>
            <TextField
              fullWidth
              sx={{ marginTop: 2 }}
              label="Descripción"
              {...register("expense_description", {})}
            >
              Descripción
            </TextField>
            <TextField
              fullWidth
              id="category-select"
              select
              label="Categoria"
              {...register("expense_category", {
                required: "Ingrese una categoria",
              })}
              sx={{ marginTop: 2 }}
              error={!!errors.expense_category}
              helperText={errors.expense_category?.message}
            >
              {expense_categories.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.value}
                </MenuItem>
              ))}
            </TextField>
            <MultiSelect
              selectedPayersNames={selectedPayersNames}
              setSelectedPayersNames={(payers: string[]) =>
                setSelectedPayersNames(payers)
                
              }
              names={Object.keys(participants)}
              text={"Pagadores"}
              continueButtonPressed={continueButtonPressed}
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
      </>
    </Modal>
  );
}
