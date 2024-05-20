import {
  Box,
  Typography,
  Button,
  InputAdornment,
  TextField,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import Modal from "@mui/material/Modal";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { Group, User } from "@/app/types";
import CustomModal from "@/app/CustomModal";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 700,
  height: 700,
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
    value: "Entretenimiento",
    label: "Entretenimiento",
  },
  {
    value: "Salud",
    label: "Salud",
  },
];

type EditUserModalProps = {
  open: boolean;
  onClose: () => void;
  getMe: () => void;
  user: User;
};

type FormValues = {
  id: string;
  name: string;
  surname: string;
  date_of_birth: string;
  phone: string;
  email: string;
  cbu: string;
};

export default function EditUserModal({
  open,
  onClose,
  getMe,
  user,
}: EditUserModalProps) {
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorText, setErrorText] = useState("");

  const form = useForm<FormValues>({
    defaultValues: {
      name: user.name,
      surname: user.surname,
      phone: user.phone,
      date_of_birth: new Date(user.date_of_birth).toISOString().split("T")[0],
      cbu: user.cbu
    },
  });

  const handleEditUser = (formData: FormValues) => {
    const jwt = localStorage.getItem("jwtToken");
    console.log("El form es: ", formData)
    if (formData.cbu == "") {
      formData.cbu = null
    }
    fetch(`http://localhost:8000/users`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({
        name: formData.name,
        surname: formData.surname,
        phone: formData.phone,
        date_of_birth: formData.date_of_birth,
        cbu: formData.cbu
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        getMe();
        onClose();
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
        onSubmit={handleSubmit(handleEditUser)}
        component="form"
      >
        <CustomModal
          open={showErrorModal}
          onClick={() => setShowErrorModal(false)}
          onClose={() => setShowErrorModal(false)}
          text={errorText}
          buttonText="Cerrar"
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
          <Typography color="white">Editar usuario</Typography>
        </Box>
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
              required: "Ingrese un nombre",
              minLength: {
                value: 3,
                message: "El nombre debe tener 3 caracteres como minimo",
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
            label="Apellido"
            {...register("surname", {})}
            error={!!errors.surname}
            helperText={errors.surname?.message}
          >
            Apellido
          </TextField>

          <TextField
            fullWidth
            sx={{ marginTop: 2 }}
            label="Telefono"
            {...register("phone", {})}
            error={!!errors.phone}
            helperText={errors.phone?.message}
          >
            Telefono
          </TextField>

          <TextField
            fullWidth
            sx={{ marginTop: 2 }}
            label="CBU"
            {...register("cbu", {
              minLength: {
                value: 22,
                message: "El cbu debe tener 22 caracteres",
              },
              maxLength: {
                value: 22,
                message: "El cbu debe tener 22 caracteres",
              },
            })}
            error={!!errors.cbu}
            helperText={errors.cbu?.message}
          >
            CBU
          </TextField>

          <TextField
            fullWidth
            id="date_of_birth"
            type="date"
            label="Birthday"
            sx={{ marginTop: 2 }}
            {...register("date_of_birth", {
              required: "Enter your birthday",
            })}
            error={!!errors.date_of_birth}
            helperText={errors.date_of_birth?.message}
            focused
          />
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