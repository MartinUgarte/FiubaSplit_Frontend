import { Box, Typography, Button, TextField } from '@mui/material';
import Modal from '@mui/material/Modal';

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
    text: string,
}

export default function CustomModal({open, onClose, text}: CustomModalProps) {    
    return (
        <Modal 
            open={open}
            onClose={() => onClose()}
        >
            <Box component="form" display='flex' flex='1' flexDirection='column' justifyContent='center' alignItems='center' sx={style}>
                <Box display='flex' flex='0.3' flexDirection='column' width='100%' justifyContent='center' alignItems='center' sx={{backgroundColor: 'blue'}}>
                    <Typography color='white'>{text}</Typography>
                </Box>         
                <Box display='flex' flex='0.7' justifyContent='center' alignItems='center'>
                    <Button 
                        type="submit"
                        variant="contained"
                        sx={{ height: 40 }}
                        onClick={() => onClose()}
                    >
                        Cerrar
                    </Button>
                </Box>
            </Box>
        </Modal>
    )

}