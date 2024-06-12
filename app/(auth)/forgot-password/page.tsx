"use client";

import {
    Box,
    Button,
    IconButton,
    InputAdornment,
    Link,
    TextField,
    ThemeProvider,
    Typography,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import CustomModal from "app/CustomModal";
import LoadingModal from "app/LoadingModal";
import { subheaderTheme } from "app/fonts";
import { API_URL } from "app/constants";

type FormValues = {
    email: string;
};

export default function LoginPage() {
    const router = useRouter();
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorText, setErrorText] = useState("");
    const [showLoading, setShowLoading] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const form = useForm<FormValues>({
        defaultValues: {
            email: "",
        },
    });

    const { register, handleSubmit, formState } = form;
    const { errors } = formState;


    const handleFormSubmit = (formData: FormValues) => {
        setShowLoading(true);
        fetch(`${API_URL}/password-recovery`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: formData.email,
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
                setShowSuccessModal(true);
                setTimeout(() => {
                    router.push("../login");
                }, 5000);
            });
    };


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
                    text="Este correo no está registrado"
                    buttonText="OK"
                />
            )}
            {showSuccessModal && (
                <CustomModal
                    open={showSuccessModal}
                    onClick={() => setShowSuccessModal(false)}
                    onClose={() => setShowSuccessModal(false)}
                    text="Correo de recuperación enviado, volverás a la página de inicio de sesión en unos segundos"
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
                            height: '58%',
                            width: '12%',
                            marginBottom: '1%',
                            marginTop: '1%'
                        }}
                        alt="The house from the offer."
                        src="https://i.imgur.com/ZP4O5bA.png"
                    />
                    <ThemeProvider theme={subheaderTheme}>
                        <Typography variant="h4">FIUBASPLIT</Typography>
                    </ThemeProvider>

                </Box>
                <Box
                    display="flex"
                    flex="0.8"
                    flexDirection="column"
                    justifyContent="flex-start"
                    width="30%"
                    sx={{ marginTop: '2%' }}
                >
                    <ThemeProvider theme={subheaderTheme}>
                        <Typography variant="h5">Recuperar Contraseña</Typography>
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
                            sx={{ marginTop: '3%', marginBottom: '10%' }}
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
                        <Button
                            type="submit"
                            variant="contained"
                            sx={{ marginTop: "2%", height: '30%' }}
                            endIcon={<SendIcon />}
                        >
                            Enviar correo de recuperación&nbsp;
                        </Button>
                    </Box>
                    <Button
                        href="../login"
                        variant="outlined"
                        sx={{ marginTop: "2%", height: '7%' }}
                    >
                        Volver
                    </Button>
                </Box>
            </Box>
        </Box>
    );
}
