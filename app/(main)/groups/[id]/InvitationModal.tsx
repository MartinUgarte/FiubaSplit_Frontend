import CustomModal from "@/app/CustomModal";
import LoadingModal from "@/app/LoadingModal";
import { Box, Typography, Button, TextField } from "@mui/material";
import Modal from "@mui/material/Modal";
import { useState } from "react";
import { useForm } from "react-hook-form";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 300,
  height: 250,
  bgcolor: "background.paper",
  boxShadow: 5,
  borderRadius: 2,
};

type InvitationModalProps = {
  open: boolean;
  onClose: () => void;
};

type FormValues = {
    email: string;
}

export default function InvitationModal({
  open,
  onClose,
}: InvitationModalProps) {

    const form = useForm<FormValues>({
        defaultValues: {
            email: '',
        }
    })

    const { register, handleSubmit, formState } = form;
    const { errors } = formState;
    const [showLoading, setShowLoading] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false)
    const [errorText, setErrorText] = useState('');
    
    const sendInvitation = (formData: FormValues) => {
        setShowLoading(true)
        const jwt = localStorage.getItem("jwtToken");
        const groupId = localStorage.getItem('groupId');
        fetch(`http://localhost:8000/invitations/groups/${groupId}/invite`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${jwt}`,

            },
            body: JSON.stringify({
                email: formData.email,
            })
        })
            .then((res) => {
                console.log(res)
                if (res.status == 201) {
                    setShowLoading(false);
                    onClose()
                }
                return res.json()
            })
            .then((data) => {
                console.log("La data: ", data);
                if (!data.id) {
                  setShowLoading(false);
                  setErrorText(data)
                  setShowErrorModal(true)
                }
            })
    }

  return (
    <Modal open={open} onClose={() => onClose()}>
      <Box
        component="form"
        onSubmit={handleSubmit(sendInvitation)}
        display="flex"
        flex="1"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        sx={style}
      >
        <LoadingModal open={showLoading} onClose={() => setShowLoading(false)} />
        <CustomModal open={showErrorModal} onClick={() => setShowErrorModal(false)} onClose={() => setShowErrorModal(false)} text={errorText} buttonText='Ok'/>
        <Box
          display="flex"
          flex="0.3"
          flexDirection="column"
          width="100%"
          justifyContent="center"
          alignItems="center"
          sx={{ backgroundColor: "blue" }}
        >
          <Typography color="white">Añadir mail del invitado</Typography>
        </Box>
        <Box
          display="flex"
          flex="0.7"
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
        >
          <TextField
            id="email"
            label="Email"
            sx={{ marginTop: 2 }}
            {...register("email", {
              required: "Ingresar un mail",
              pattern: {
                value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                message: "Ingresa un mail válido",
              },
            })}
            error={!!errors.email}
            helperText={errors.email?.message}
          />
          <Button
            type="submit"
            variant="contained"
            sx={{ height: 40, marginTop: 5 }}
          >
            Invitar
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
