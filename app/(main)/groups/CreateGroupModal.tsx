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
    width: 700,
    height: 700,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 10,
};

const categories = [
    {
        value: 'Friends',
        label: 'Friends',
    },
    {
        value: 'Family',
        label: 'Family',
    },
    {
        value: 'Entertaiment',
        label: 'Entertaiment',
    },
    {
        value: "Health",
        label: "Health"
    },
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

    const [selectedCategory, setSelectedCategory] = useState<string>("Entertaiment");
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorText, setErrorText] = useState('');

    const form = useForm<FormValues>({
        defaultValues: {
            name: '',
            description: '',
            category: 'Category',
        }
    })

    const handleCreateGroup = (formData: FormValues) => {
        const jwt = localStorage.getItem('jwtToken');
        fetch(`http://localhost:8000/groups`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwt}`
            },
            body: JSON.stringify({
                name: formData.name,
                description: formData.description,
                category: selectedCategory,
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

    const handleChangeCategory = (group: SelectChangeEvent) => {
        setSelectedCategory(group.target.value as string);
    };

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
                <Box display='flex' flex='0.6' flexDirection="column" justifyContent='center' alignItems='center'>

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

                    <Select
                        sx={{ marginTop: 2 }}
                        labelId='project-leader-select-label'
                        id='project-leader-select'
                        fullWidth
                        label='Category'
                        value={selectedCategory}
                        onChange={handleChangeCategory}
                    >
                        {categories.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.value}
                            </MenuItem>
                        ))}
                    </Select>
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