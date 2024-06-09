import {
    Box,
    Typography,
    Button,
    InputAdornment,
    TextField,
    MenuItem,
    Select,
    SelectChangeEvent,
    ThemeProvider,
  } from "@mui/material";
  import Modal from "@mui/material/Modal";
  import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
  import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
  import { DatePicker } from "@mui/x-date-pickers/DatePicker";
  import { useForm } from "react-hook-form";
  import { useState } from "react";
  import dayjs, { Dayjs } from "dayjs";
  import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
  import { Expense, Group, expense_categories } from "@/app/types";
  import CustomModal from "@/app/CustomModal";
import { modalTheme } from "@/app/fonts";
import UploadButton from "@/app/UploadButton";
  
  const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "30%",
    height: '70%',
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 10,
  };


  
  type EditExpenseModalProps = {
    open: boolean;
    onClose: () => void;
    getExpenses: () => void;
    expense: Expense;
  };
  
  type FormValues = {
    name: string;
    description: string;
    category: string;
  };
  
  export default function EditExpenseModal({
    open,
    onClose,
    getExpenses,
    expense,
  }: EditExpenseModalProps) {
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorText, setErrorText] = useState('');
  
    const form = useForm<FormValues>({
      defaultValues: {
        name: expense.name,
        category: expense.category,
        description: expense.description,
      },
    });
  
    const handleEditExpense = (formData: FormValues) => {
      const jwt = localStorage.getItem("jwtToken");
      fetch(`http://localhost:8000/expenses/${expense.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          category: formData.category,
        }),
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          if (data == "This name is alredy used") {
            setErrorText(data);
            setShowErrorModal(true);
          } else {
            onClose();
            getExpenses();
          }
        });
    };
  
    const { register, handleSubmit, formState } = form;
    const { errors } = formState;
  
    return (
      <Modal open={open} onClose={() => onClose()}>
        <Box
          display="flex"
          flex="1"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          sx={style}
          onSubmit={handleSubmit(handleEditExpense)}
          component="form"
        >
          <CustomModal open={showErrorModal} onClick={() => setShowErrorModal(false)} onClose={() => setShowErrorModal(false)} text={errorText} buttonText='Ok'/>
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
                    <Typography color='white'>Editar Gasto</Typography>
                    </ThemeProvider>
          </Box>
          <UploadButton/>
          <Box
            display="flex"
            flex="0.6"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
          >
            <TextField
              sx={{ marginTop: 2 }}
              fullWidth
              label="Nombre"
              {...register("name", {
                required: "Ingresar un nombre",
                minLength: {
                  value: 3,
                  message: "El nombre debe tener como minimo 3 caracteres",
                },
              })}
              error={!!errors.name}
              helperText={errors.name?.message}
            >
              Nombre
            </TextField>
  
            <TextField
              fullWidth
              sx={{ marginTop: 2 }}
              label="Descripcion"
              {...register("description", {})}
              error={!!errors.description}
              helperText={errors.description?.message}
            >
              Descripcion
            </TextField>
  
            <TextField
                fullWidth
                id='category-select'
                select
                label='Categoria'
                {...register('category', {})}
                sx={{ marginTop: 2 }}
            >
                {expense_categories.map((option) => (
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
            <Button type="submit" variant="contained" sx={{ height: 40 }}>
              Editar
            </Button>
          </Box>
        </Box>
      </Modal>
    );
  }
  