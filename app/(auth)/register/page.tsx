"use client";

import {
  Box,
  Button,
  FilledTextFieldProps,
  IconButton,
  InputAdornment,
  OutlinedTextFieldProps,
  StandardTextFieldProps,
  TextField,
  TextFieldVariants,
  Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useRouter } from "next/navigation";
import { JSX, useState } from "react";
import dayjs, { Dayjs } from "dayjs";


type FormValues = {
  name: string;
  surname: string;
  email: string;
  password: string;
  phone: string;
  date_of_birth: Dayjs;
};

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>();

  const form = useForm<FormValues>({
    defaultValues: {
      name: "",
      surname: "",
      email: "",
      password: "",
      phone: "",
      date_of_birth: dayjs("2022-04-18"),
    },
  });

  const { register, handleSubmit, formState } = form;
  const { errors } = formState;

  const handleFormSubmit = (formData: FormValues) => {
    console.log(formData);
  };

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = () => setShowPassword(!showPassword);

  function setError(newError: any) {
    throw new Error("Function not implemented.");
  }

  return (
    <Box
      display="flex"
      flex="1"
      flexDirection="column"
      height="100vh"
      alignItems="center"
      justifyContent="center"
    >
      <Box
        display="flex"
        flex="1"
        flexDirection="column"
        width="100%"
        justifyContent="space-around"
        alignItems="center"
      >
        <Box
          display="flex"
          flex="0.2"
          justifyContent="center"
          alignItems="center"
          width="100%"
        >
          <Typography variant="h4">FIUBASPLIT</Typography>
        </Box>
        <Box
          display="flex"
          flex="0.8"
          flexDirection="column"
          justifyContent="center"
          width="30%"
        >
          <Typography variant="h5" align="center">
            ¡Welcome!
          </Typography>
          <Box
            component="form"
            display="flex"
            flexDirection="column"
            justifyContent="center"
            onSubmit={handleSubmit(handleFormSubmit)}
          >
            <TextField
              id="name"
              label="Name"
              sx={{ marginTop: 5 }}
              {...register("name", {
                required: "Enter your name",
              })}
              error={!!errors.name}
              helperText={errors.name?.message}
            />
            <TextField
              id="surname"
              label="Surname"
              sx={{ marginTop: 5 }}
              {...register("surname", {
                required: "Enter your surname",
              })}
              error={!!errors.surname}
              helperText={errors.surname?.message}
            />
            <TextField
              id="email"
              label="Email"
              sx={{ marginTop: 5 }}
              {...register("email", {
                required: "Enter you email",
                pattern: {
                  value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                  message: "Enter a valid email",
                },
              })}
              error={!!errors.email}
              helperText={errors.email?.message}
            />
            <TextField
              label="Password"
              id="password"
              type={showPassword ? "text" : "password"}
              sx={{ marginTop: 5 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              {...register("password", {
                required: "Enter your password",
              })}
              error={!!errors.password}
              helperText={errors.password?.message}
            />
            <TextField
              id="phone"
              label="Phone"
              sx={{ marginTop: 5 }}
              {...register("phone", {
                required: "Enter your phone",
              })}
              error={!!errors.phone}
              helperText={errors.phone?.message}
            />
            <TextField
              id="date_of_birth"
              type='date'
              label="Birthday"
              sx={{ marginTop: 5 }}
              {...register("date_of_birth", {
                required: "Enter your birthday",
              })}
              error={!!errors.date_of_birth}
              helperText={errors.date_of_birth?.message}
              focused
            />
            <Button
              type="submit"
              variant="contained"
              sx={{ marginTop: 5, height: 50 }}
            >
              Registrarse
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
