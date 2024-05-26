import { ExpenseFilters, Filters } from '@/app/types';
import { Box, Typography, Button, SelectChangeEvent, TextField, Select, MenuItem, InputAdornment } from '@mui/material';
import Modal from '@mui/material/Modal';
import { Dispatch, SetStateAction } from 'react';

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    height: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 10,
};

type FilterExpenseModalProps = {
    open: boolean,
    onClose: () => void,
    submitFilters: () => void,
    selectedFilters: ExpenseFilters
    setSelectedFilters: Dispatch<SetStateAction<ExpenseFilters>>,
}

export default function FilterExpenseModal({ open, onClose, selectedFilters, setSelectedFilters, submitFilters }: FilterExpenseModalProps) {

    return (
        <Modal
            open={open}
            onClose={() => onClose()}
        >
            <Box component="form" display='flex' flex='1' flexDirection='column' justifyContent='center' alignItems='center' sx={style}>
                <Box display='flex' flex='0.2' flexDirection='column' width='100%' height='100%' justifyContent='center' alignItems='center' sx={{ backgroundColor: 'blue' }}>
                    <Typography color='white'>Filtrar Gastos</Typography>
                </Box>
                <Box display='flex' flexDirection='column' flex='0.8' justifyContent='center' alignItems='center'>
                    <TextField
                        fullWidth
                        label="Nombre"
                        value={selectedFilters.name}
                        onChange={(group) => setSelectedFilters(prevState => ({ ...prevState, name: group.target.value as string }))}
                    >
                        Nombre
                    </TextField>
                </Box>
                <Box display='flex' flex='0.2' justifyContent='center' alignItems='center'>
                    <Button
                        variant="contained"
                        sx={{ height: 40 }}
                        onClick={() => submitFilters()}
                    >
                        Aceptar
                    </Button>
                </Box>
            </Box>
        </Modal>
    )

}