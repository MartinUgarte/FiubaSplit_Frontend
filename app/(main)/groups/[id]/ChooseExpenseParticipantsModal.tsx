import { Filters, Group } from '@/app/types';
import { Box, Typography, Button, SelectChangeEvent, TextField, Select, MenuItem, InputAdornment } from '@mui/material';
import Modal from '@mui/material/Modal';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import MultiSelect from './MultiSelect';
import { useForm } from 'react-hook-form';
import ChoosePayersAmountModal from './ChoosePayersAmountModal';
import ChooseExpensePercentagesModal from './ChooseExpensePercentagesModal';

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    height: 600,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 10,
};

type ChooseExpenseParticipantsModalProps = {
    open: boolean,
    onClose: () => void,
    group: Group
}

type FormValues = {
    amount: string;
    name: string;
}

export default function ChooseExpenseParticipantsModal({ open, onClose, group }: ChooseExpenseParticipantsModalProps) {
    const [members, setMembers] = useState<string[]>([])
    const [selectedPayers, setSelectedPayers] = useState<string[]>([]);
    const [selectedDebtors, setSelectedDebtors] = useState<string[]>([]);
    const [showChoosePayersAmountModal, setShowChoosePayersAmountModal] = useState<boolean>(false)
    const [showChooseExpensePercentagesModal, setShowChooseExpensePercentagesModal] = useState<boolean>(false)

    const form = useForm<FormValues>({
        defaultValues: {
            amount: '',
            name: '',
        }
    })
    
    const { register, handleSubmit, formState } = form;
    const { errors } = formState

    const getMemberName = (memberId: string) => {
        const jwt = localStorage.getItem("jwtToken");
        if (!jwt) {
          return Promise.reject(new Error("JWT not found"));
        }
        return fetch(`http://localhost:8000/users/${memberId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`,
          },
        })
          .then((res) => {
            if (!res.ok) {
              throw new Error("Network response was not ok");
            }
            return res.json();
          })
          .then((data) => data.name) 
          .catch((error) => {
            console.error('Error fetching user:', error);
            return null;
          });
      };

      const fetchUserNames = () => {
        Promise.all(group.members.map(id => getMemberName(id)))
          .then(names => {
            setMembers(names);
            console.log("User names fetched: ", names);
          })
          .catch(error => {
            console.error("Error fetching names: ", error);
          });
      };
      
      useEffect(() => {
        if (open) {
            console.log("Se activo el useEffect")
            fetchUserNames();
        }
      }, [open]);
    
    const handleNewExpense = (formData: FormValues) => {
        setShowChoosePayersAmountModal(true)
        console.log()
    }

    const closeAllModals = () => {
        setShowChoosePayersAmountModal(false)
        setShowChooseExpensePercentagesModal(false)
        onClose()
    }

    return (
        <Modal
            open={open}
            onClose={() => onClose()}
        >
            <Box component="form" onSubmit={handleSubmit(handleNewExpense)} display='flex' flex='1' flexDirection='column' justifyContent='center' alignItems='center' sx={style}>
                <ChoosePayersAmountModal setShowChooseExpensePercentagesModal={() => setShowChooseExpensePercentagesModal(true)} open={showChoosePayersAmountModal} onClose={() => setShowChoosePayersAmountModal(false)} selectedPayers={selectedPayers} />
                <ChooseExpensePercentagesModal open={showChooseExpensePercentagesModal} onClose={() => setShowChooseExpensePercentagesModal(false)} members={members} closeAllModals={() => closeAllModals()}/>
                <Box display='flex' flex='0.2' flexDirection='column' width='100%' height='100%' justifyContent='center' alignItems='center' sx={{ backgroundColor: 'blue' }}>
                    <Typography color='white'>Crear Gasto</Typography>
                </Box>
                <Box display='flex' flexDirection='column' flex='0.8' justifyContent='center' alignItems='center' width='80%' height='80%'>
                <TextField
                        fullWidth
                        sx={{ marginTop: 2 }}
                        label="Nombre"
                        {...register('name', {
                            required: "Ingresa el nombre del gasto",
                        })}
                        error={!!errors.name}
                        helperText={errors.amount?.message}
                    >
                        Nombre
                    </TextField>
                <TextField
                        fullWidth
                        type='number'
                        sx={{ marginTop: 2 }}
                        label="Monto"
                        {...register('amount', {
                            required: "Ingrese un monto",
                        })}
                        error={!!errors.amount}
                        helperText={errors.amount?.message}
                    >
                        Monto
                    </TextField>
                    <MultiSelect selectedParticipants={selectedPayers} setSelectedParticipants={(payers: string[]) => setSelectedPayers(payers)} names={members} text={"Pagadores"}/>
                </Box>
                <Box display='flex' flex='0.2' justifyContent='center' alignItems='center'>
                    <Button
                        variant="contained"
                        sx={{ height: 40 }}
                        type='submit'
                    >
                        Continuar
                    </Button>
                </Box>
            </Box>
        </Modal>
    )

}