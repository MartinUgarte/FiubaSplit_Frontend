import { Box, Typography, Button, TextField, ThemeProvider, IconButton } from '@mui/material';
import Modal from '@mui/material/Modal';
import { Expense } from 'app/types';

import { modalTheme } from 'app/fonts';
import ImageSearchIcon from '@mui/icons-material/ImageSearch';
import { useState } from 'react';
import CustomModal from 'app/CustomModal';

const style = {
    position: 'absolute' as 'absolute',
    top: '55%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '30%',
    height: '70%',
    bgcolor: 'background.paper',
    boxShadow: 5,
    borderRadius: 2,
};

type ImageModalProps = {
    open: boolean,
    onClose: () => void,
    expense: Expense,
    getExpense: () => void
}

export default function ImageModal({ open, onClose, expense, getExpense }: ImageModalProps) {
    const imageSizeLimit = 100000000; // 10MB
    const [showImageUploadErrorModal, setShowImageUploadErrorModal] = useState(false);
    const [imageErrorMsg, setImageErrorMsg] = useState("");

    const handleFileChange = (event: any) => {
        const jwt = localStorage.getItem("jwtToken");
        if (!jwt) {
            return;
        }
        const file = event.target.files[0];
        if (file) {
            if (file.size > imageSizeLimit) {
                console.log("TAMAÑO EXCEDIDO")
                setImageErrorMsg("El tamaño del archivo es mayor a 10MB. Por favor, seleccione un archivo más pequeño.");
                setShowImageUploadErrorModal(true);
                return;
            } else if (file.type !== "image/jpg" && file.type !== "image/png") {
                console.log("NO ES IMAGEN")
                setImageErrorMsg("El archivo seleccionado no es un formato de imagen válido. Por favor, seleccione un archivo en formato JPG o PNG.");
                setShowImageUploadErrorModal(true);
                return;
            }

            const form = new FormData();
            form.append("expense_id", expense.id)
            form.append("image", file);

            fetch(`${process.env.NEXT_PUBLIC_API_URL}/expenses/image`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
                body: form as any // Cast to any to bypass TypeScript type checking for fetch body
            })
                .then((res) => {
                    if (!res.ok) {
                        throw new Error("Network response was not ok");
                    }
                    return res.json();
                })
                .then((data) => {
                    console.log("Image uploaded: ", data);
                    getExpense()
                })
                .catch((error) => {
                    console.error("Error uploading file:", error);
                });
        }
    }

    return (
        <Modal
            open={open}
            onClose={() => onClose()}
        >
            <Box component="form" display='flex' flex='1' flexDirection='column' justifyContent='center' alignItems='center' sx={style}>
                {showImageUploadErrorModal && (
                    <CustomModal
                        open={showImageUploadErrorModal}
                        onClick={() => setShowImageUploadErrorModal(false)}
                        onClose={() => setShowImageUploadErrorModal(false)}
                        text={imageErrorMsg}
                        buttonText="OK"
                    />
                )}
                <Box display='flex' flex='0.3' flexDirection='column' width='100%' justifyContent='center' alignItems='center' sx={{ backgroundColor: '#5c93c4' }}>
                    <ThemeProvider theme={modalTheme}>
                        <Typography color='white'>Imagen del gasto</Typography>
                    </ThemeProvider>
                </Box>
                {expense.image_link != null ? (

                    <Box
                        component="img"
                        sx={{
                            height: '58%',
                            width: '50%',
                            marginBottom: '1%',
                            marginTop: '1%'
                        }}
                        alt="The house from the offer."
                        src={expense.image_link}
                    />
                ) : (
                    <Box flex='1' display='flex' justifyContent='center' alignItems='flex-end'>
                        <Typography>No hay imagen de gasto</Typography>
                    </Box>
                )}
                <Box display='flex' flex='1' width='100%' flexDirection='row' justifyContent='flex-end' sx={{ mr: '35%', mt: '-6%' }}>
                    <input
                        accept="image/*"
                        style={{ display: 'none' }}
                        id="upload-photo"
                        type="file"
                        onChange={handleFileChange}
                    />
                    <label htmlFor="upload-photo">
                        <IconButton component="span" sx={{ marginBottom: '15%' }}>
                            <ImageSearchIcon />
                        </IconButton>
                    </label>
                </Box>
                <Box display='flex' flex='0.7' justifyContent='center' alignItems='center'>
                    <Button
                        type="submit"
                        variant="contained"
                        sx={{ height: 40, marginBottom: '-60%' }}
                        onClick={() => onClose()}
                    >
                        Cerrar
                    </Button>
                </Box>
            </Box>
        </Modal>
    )

}