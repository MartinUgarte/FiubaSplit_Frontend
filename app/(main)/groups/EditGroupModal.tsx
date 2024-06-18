import {
    Box,
    Typography,
    Button,
    InputAdornment,
    TextField,
    MenuItem,
    Select,
    SelectChangeEvent,
    ThemeProvider,
} from "@mui/material";
import Modal from "@mui/material/Modal";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useForm } from "react-hook-form";
import { useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { Group } from "app/types";
import CustomModal from "app/CustomModal";
import { modalTheme } from "app/fonts";


const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: '20%',
    height: '50%',
    bgcolor: "background.paper",
    border: "2px solid #000",
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

type EditGroupModalProps = {
    open: boolean;
    onClose: () => void;
    getGroups: () => void;
    group: Group;
};

type FormValues = {
    name: string;
    description: string;
    category: string;
};

export default function EditGroupModal({
    open,
    onClose,
    getGroups,
    group,
}: EditGroupModalProps) {
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorText, setErrorText] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>(
        group.category
    );

    const form = useForm<FormValues>({
        defaultValues: {
            name: group.name,
            category: group.category,
            description: group.description,
        },
    });

    const handleEditGroup = (formData: FormValues) => {
        const jwt = localStorage.getItem("jwtToken");
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/groups/${group.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwt}`,
            },
            body: JSON.stringify({
                name: formData.name,
                description: formData.description,
                category: selectedCategory,
                creator_id: group.creator_id,
                members: group.members,
                admin: group.admins,
                balances: {}
            }),
        })
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                if (data == "This name is alredy used") {
                    setErrorText(data);
                    setShowErrorModal(true);
                } else {
                    onClose();
                    getGroups();
                }
            });
    };

    const handleChangeCategory = (group: SelectChangeEvent) => {
        setSelectedCategory(group.target.value as string);
    };

    const { register, handleSubmit, formState } = form;
    const { errors } = formState;

    return (
        <Modal open={open} onClose={() => onClose()}>
            <Box
                display="flex"
                flex="1"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                sx={style}
                onSubmit={handleSubmit(handleEditGroup)}
                component="form"
            >
                <CustomModal open={showErrorModal} onClick={() => setShowErrorModal(false)} onClose={() => setShowErrorModal(false)} text={errorText} buttonText='Ok' />
                <Box
                    display="flex"
                    flex="0.2"
                    flexDirection="column"
                    width="100%"
                    height="100%"
                    justifyContent="center"
                    alignItems="center"
                    sx={{ backgroundColor: "#5c93c4" }}
                >
                    <ThemeProvider theme={modalTheme}>
                        <Typography color='white'>Editar grupo</Typography>
                    </ThemeProvider>
                </Box>
                <Box
                    display="flex"
                    flex="0.6"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                >
                    <TextField
                        sx={{ marginTop: 2 }}
                        fullWidth
                        label="Nombre"
                        {...register("name", {
                            required: "Ingresar un nombre",
                            minLength: {
                                value: 3,
                                message: "El nombre debe tener como minimo 3 caracteres",
                            },
                        })}
                        error={!!errors.name}
                        helperText={errors.name?.message}
                    >
                        Nombre
                    </TextField>

                    <TextField
                        fullWidth
                        sx={{ marginTop: 2 }}
                        label="Descripcion"
                        {...register("description", {})}
                        error={!!errors.description}
                        helperText={errors.description?.message}
                    >
                        Descripcion
                    </TextField>

                    <Select
                        sx={{ marginTop: 2 }}
                        labelId="project-leader-select-label"
                        id="project-leader-select"
                        fullWidth
                        label="Categoria"
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
                <Box
                    display="flex"
                    flex="0.2"
                    justifyContent="center"
                    alignItems="center"
                >
                    <Button type="submit" variant="contained" sx={{ height: 40 }}>
                        Editar
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
}
