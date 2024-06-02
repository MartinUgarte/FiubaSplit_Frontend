import { Box, Typography, Button, TextField, CircularProgress, ThemeProvider } from '@mui/material';
import Modal from '@mui/material/Modal';
import { modalTheme } from './fonts';

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 300,
    height: 200,
    bgcolor: 'background.paper',
    boxShadow: 50,
    borderRadius: 3,
};

type LoadingModalProps = {
    open: boolean,
    onClose: () => void,
}

export default function LoadingModal({open, onClose}: LoadingModalProps) {    
    return (
        <Modal 
            open={open}
            onClose={() => onClose()}
        >
            <Box component="form" display='flex' flex='1' flexDirection='column' justifyContent='center' alignItems='center' sx={style}>       
                <Box display='flex' flexDirection='column' justifyContent='center' alignItems='center'>
                    <CircularProgress />
                    <ThemeProvider theme={modalTheme}>
                    <Typography color='white'>Cargando...</Typography>
                    </ThemeProvider>
                </Box>
            </Box>
        </Modal>
    )

}