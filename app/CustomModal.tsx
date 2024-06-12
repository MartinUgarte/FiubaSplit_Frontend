import { Box, Typography, Button, TextField, ThemeProvider } from '@mui/material';
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
    boxShadow: 5,
    borderRadius: 2,
};

type CustomModalProps = {
    open: boolean,
    onClose: () => void,
    onClick: () => void,
    text: string,
    buttonText: string,
}

export default function CustomModal({ open, onClose, onClick, text, buttonText }: CustomModalProps) {
    return (
        <Modal
            open={open}
            onClose={() => onClose()}
        >
            <Box component="form" display='flex' flex='1' flexDirection='column' justifyContent='center' alignItems='center' sx={style}>
                <Box display='flex' flex='0.3' flexDirection='column' width='100%' justifyContent='center' alignItems='center' sx={{ backgroundColor: '#5c93c4', minHeight: '300px', minWidth: '600px', padding: '30px', borderRadius: 3 }}>
                    <ThemeProvider theme={modalTheme}>
                        <Typography color='white' >{text}</Typography>
                    </ThemeProvider>
                    <Box display='flex' flex='0.7' justifyContent='center' alignItems='center' marginBottom='-20%'>
                        <Button
                            type="submit"
                            variant="contained"
                            sx={{ height: 40 }}
                            onClick={() => onClick()}
                        >
                            {buttonText}
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Modal>
    )

}