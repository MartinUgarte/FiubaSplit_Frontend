"use client";

import { Box, Button, IconButton, InputAdornment, TextField, Typography } from '@mui/material'
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { set, useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import CustomModal from '@/app/CustomModal';
import LoadingModal from '@/app/LoadingModal';

type FormValues = {
    email: string;
    password: string;
}

export default function LoginPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [showLoading, setShowLoading] = useState(false);

    const form = useForm<FormValues>({
        defaultValues: {
            email: '',
            password: ''
        }
    })

    const { register, handleSubmit, formState } = form;
    const { errors } = formState;

    const handleFormSubmit = (formData: FormValues) => {
        console.log('Aprete login: ', formData);
        setShowLoading(true);
        router.push('../groups');
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
            {showErrorModal && (<CustomModal open={showErrorModal} onClick={() => setShowErrorModal(false)} onClose={() => setShowErrorModal(false)} text="Usuario o contraseña incorrectos" buttonText='Close'/>)}
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
                    <Typography variant="h5">
                        Login
                    </Typography>
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
                            {...register('email', {
                                required: 'Enter you email',
                                pattern: {
                                    value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                                    message: 'Enter a valid email'
                                }
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
                                )
                            }}
                            {...register('password', {
                                required: 'Ingresa la contraseña',
                            })}
                            error={!!errors.password}
                            helperText={errors.password?.message}
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            sx={{ marginTop: 5, height: 50 }}>
                            Iniciar sesión
                        </Button>
                    </Box>
                    <Button
                        href="../register"
                        variant="outlined"
                        sx={{ marginTop: 2, height: 50 }}>
                        Registrarse
                    </Button>
                </Box>
            </Box>
        </Box>
    )
}
