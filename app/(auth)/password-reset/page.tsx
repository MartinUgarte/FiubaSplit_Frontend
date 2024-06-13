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
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import CustomModal from "app/CustomModal";
import LoadingModal from "app/LoadingModal";
import { subheaderTheme } from "app/fonts";


type FormValues = {
    new_password: string;
    confirm_password: string;
};

export default function LoginPage() {
    const router = useRouter();
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [showMismatchModal, setShowMismatchModal] = useState(false);
    const [errorText, setErrorText] = useState("");
    const [showLoading, setShowLoading] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const searchParams = useSearchParams();
    const token = searchParams.get("token");


    const form = useForm<FormValues>({
        defaultValues: {
            new_password: "",
            confirm_password: "",
        },
    });

    const { register, handleSubmit, formState } = form;
    const { errors } = formState;


    const handleFormSubmit = (formData: FormValues) => {
        if (formData.new_password !== formData.confirm_password) {
            setShowMismatchModal(true);
            return;
        }

        setShowLoading(true);

        fetch(`${process.env.NEXT_PUBLIC_API_URL}/password-reset`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                new_password: formData.new_password,
            }),
        })
            .then((res) => {
                console.log(res);
                if (res.status == 401) {
                    setErrorText("User not found");
                    setShowErrorModal(true);
                    setShowLoading(false);
                    setTimeout(() => {
                        router.push("../forgot-password");
                    },
                        5000
                    );
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

    const handleClickShowNewPassword = () => setShowNewPassword(!showNewPassword);
    const handleMouseDownNewPassword = () => setShowNewPassword(!showNewPassword);


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
                    text="El codigo de recuperación expiró, por favor intenta de nuevo"
                    buttonText="OK"
                />
            )}
            {showMismatchModal && (
                <CustomModal
                    open={showMismatchModal}
                    onClick={() => setShowMismatchModal(false)}
                    onClose={() => setShowMismatchModal(false)}
                    text="Las contraseñas no coinciden"
                    buttonText="OK"
                />
            )}
            {showSuccessModal && (
                <CustomModal
                    open={showSuccessModal}
                    onClick={() => setShowSuccessModal(false)}
                    onClose={() => setShowSuccessModal(false)}
                    text="Contraseña cambiada con éxito, volverás a la página de inicio de sesión en unos segundos"
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
                        <Typography variant="h5">Restalecer Contraseña</Typography>
                    </ThemeProvider>
                    <Box
                        component="form"
                        display="flex"
                        flexDirection="column"
                        justifyContent="center"
                        onSubmit={handleSubmit(handleFormSubmit)}
                    >
                        <TextField
                            label="New Password"
                            id="password"
                            type={showNewPassword ? "text" : "password"}
                            sx={{ marginTop: '2%' }}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowNewPassword}
                                            onMouseDown={handleMouseDownNewPassword}
                                        >
                                            {showNewPassword ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            {...register("new_password", {
                                required: "Ingresa la nueva contraseña",
                            })}
                            error={!!errors.new_password}
                            helperText={errors.new_password?.message}
                        />
                        <TextField
                            label="Confirm Password"
                            id="cpassword"
                            type={showNewPassword ? "text" : "password"}
                            sx={{ marginTop: '2%' }}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowNewPassword}
                                            onMouseDown={handleMouseDownNewPassword}
                                        >
                                            {showNewPassword ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            {...register("confirm_password", {
                                required: "Ingresa la nueva contraseña",
                            })}
                            error={!!errors.confirm_password}
                            helperText={errors.confirm_password?.message}
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            sx={{ marginTop: "2%", height: '30%' }}
                        >
                            Establecer nueva contraseña
                        </Button>

                    </Box>
                </Box>
            </Box>
        </Box>
    );
}
