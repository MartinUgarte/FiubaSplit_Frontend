"use client";

import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  TextField,
  ThemeProvider,
  Typography,
  createTheme,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { set, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import CustomModal from "@/app/CustomModal";
import LoadingModal from "@/app/LoadingModal";
import Image from "next/image";
import { subheaderTheme } from "@/app/fonts";

type FormValues = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [showLoading, setShowLoading] = useState(false);

  const form = useForm<FormValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { register, handleSubmit, formState } = form;
  const { errors } = formState;

  const getMe = () => {
    const jwt = localStorage.getItem("jwtToken");
    fetch(`http://localhost:8000/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
    })
      .then((res) => {
        console.log(res);
        if (res.status == 401) {
          setErrorText("User not found");
          setShowErrorModal(true);
        } else if (res.status == 200) {
          setShowLoading(false);
        }
        return res.json();
      })
      .then((data) => {
        console.log("La data: ", data);
        if (data.id) {
          console.log("Got data from login id: ", data);
          localStorage.setItem("userId", data.id);
          router.push("../groups");
        }
      });
  };

  const handleFormSubmit = (formData: FormValues) => {
    setShowLoading(true);
    fetch(`http://localhost:8000/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: formData.email,
        password: formData.password,
      }),
    })
      .then((res) => {
        console.log(res);
        if (res.status == 401) {
          setErrorText("User not found");
          setShowErrorModal(true);
          setShowLoading(false);
        } else if (res.status == 200) {
          setShowLoading(false);
        }
        return res.json();
      })
      .then((data) => {
        console.log("La data: ", data);
        if (data.access_token) {
          console.log("Got data from login id: ", data);
          localStorage.setItem("jwtToken", data.access_token);
          getMe();
        }
      });
  };

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = () => setShowPassword(!showPassword);

  return (
    <Box
      display="flex"
      flex="1"
      flexDirection="column"
      height="100vh"
      alignItems="center"
      justifyContent="center"
    >
      {showErrorModal && (
        <CustomModal
          open={showErrorModal}
          onClick={() => setShowErrorModal(false)}
          onClose={() => setShowErrorModal(false)}
          text="Usuario o contraseña incorrectos"
          buttonText="OK"
        />
      )}
      <LoadingModal open={showLoading} onClose={() => setShowLoading(false)} />
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
          flexDirection="column"
          width="100%"
        >
          <Box
            component="img"
            sx={{
              height: 300,
              width: 300,
              marginBottom: 5,
              marginTop: 5
            }}
            alt="The house from the offer."
            src="https://i.imgur.com/ZP4O5bA.png"
          />

            <Typography variant="h4">FIUBASPLIT</Typography>
          
        </Box>
        <Box
          display="flex"
          flex="0.8"
          flexDirection="column"
          justifyContent="flex-start"
          width="30%"
          sx={{marginTop: 7}}
        >
          <ThemeProvider theme={subheaderTheme}>
            <Typography variant="h5">Login</Typography>
          </ThemeProvider>
          <Box
            component="form"
            display="flex"
            flexDirection="column"
            justifyContent="center"
            onSubmit={handleSubmit(handleFormSubmit)}
          >
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
                required: "Ingresa la contraseña",
              })}
              error={!!errors.password}
              helperText={errors.password?.message}
            />
            <Button
              type="submit"
              variant="contained"
              sx={{ marginTop: 5, height: 50 }}
            >
              Iniciar sesión
            </Button>
          </Box>
          <Button
            href="../register"
            variant="outlined"
            sx={{ marginTop: 2, height: 50 }}
          >
            Registrarse
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
