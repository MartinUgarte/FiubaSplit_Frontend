import { Box, Typography, Button, InputAdornment, TextField, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import Modal from '@mui/material/Modal';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import CustomModal from '@/app/CustomModal';


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

const categories = [
    {
      value: "Amigos",
      label: "Amigos",
    },
    {
      value: "Familia",
      label: "Familia",
    },
    {
        value: "Pareja",
        label: "Pareja",
    },
    {
      value: "Entretenimiento",
      label: "Entretenimiento",
    },
    {
      value: "Viaje",
      label: "Viaje",
    },
    {
        value: "Comida",
        label: "Comida"
    }
];

type CreateGroupModalProps = {
    open: boolean,
    onClose: () => void,
    getGroups: () => void,
}

type FormValues = {
    name: string;
    description: string;
    category: string;
}

export default function CreateGroupModal({ open, onClose, getGroups }: CreateGroupModalProps) {

    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorText, setErrorText] = useState('');

    const form = useForm<FormValues>({
        defaultValues: {
            name: '',
            description: '',
            category: '',
        }
    })

    const handleCreateGroup = (formData: FormValues) => {
        const jwt = localStorage.getItem('jwtToken');
        console.log('Creando grupo: ', formData);
        fetch(`http://localhost:8000/groups`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwt}`
            },
            body: JSON.stringify({
                name: formData.name,
                description: formData.description,
                category: formData.category,
            })
        }).then((res) => {
            return res.json()
        }).then((data) => {
            if (data == "This name is alredy used") {
                setErrorText(data);
                setShowErrorModal(true);
            } else {
                onClose();
                getGroups()    
            }
        })

    }

    const { register, handleSubmit, formState } = form;
    const { errors } = formState

    return (
        <Modal
            open={open}
            onClose={() => onClose()}
        >   
            <Box display='flex' flex='1' flexDirection='column' justifyContent='center' alignItems='center' sx={style} onSubmit={handleSubmit(handleCreateGroup)} component="form">
                <CustomModal open={showErrorModal} onClick={() => setShowErrorModal(false)} onClose={() => setShowErrorModal(false)} text={errorText} buttonText='Close'/>
                <Box display='flex' flex='0.2' flexDirection='column' width='100%' height='100%' justifyContent='center' alignItems='center' sx={{ backgroundColor: 'blue' }}>
                    <Typography color='white'>Create Group</Typography>
                </Box>
                <Box display='flex' flex='0.8' flexDirection="column" justifyContent='center' alignItems='center'>

                    <TextField
                        fullWidth
                        label="Name"
                        sx={{ marginTop: 2 }}
                        {...register('name', {
                            required: 'Enter a name',
                            minLength: {
                                value: 3,
                                message: 'Name must be at least 3 chars long'
                            }
                        })}
                        error={!!errors.name}
                        helperText={errors.name?.message}
                    >
                        Name
                    </TextField>

                    <TextField
                        fullWidth
                        sx={{ marginTop: 2 }}
                        label="Description"
                        {...register('description', {})}
                        error={!!errors.description}
                        helperText={errors.description?.message}
                    >
                        Description
                    </TextField>
                        
                    <TextField
                        fullWidth
                        id='category-select'
                        select
                        label='Categoria'
                        {...register('category', {})}
                        sx={{ marginTop: 2 }}
                    >
                        {categories.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.value}
                            </MenuItem>
                        ))}
                    </TextField>
                </Box>
                <Box display='flex' flex='0.2' justifyContent='center' alignItems='center'>
                    <Button
                        type="submit"
                        variant="contained"
                        sx={{ height: 40 }}
                    >
                        Create
                    </Button>
                </Box>
            </Box>
        </Modal>
    )

}