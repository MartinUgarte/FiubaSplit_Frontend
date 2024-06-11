import { Box, Typography, Button, TextField, ThemeProvider, IconButton } from '@mui/material';
import Modal from '@mui/material/Modal';
import { Expense } from 'app/types';
import { API_URL } from 'app/constants';
import { modalTheme } from 'app/fonts';
import ImageSearchIcon from '@mui/icons-material/ImageSearch';

const style = {
    position: 'absolute' as 'absolute',
    top: '55%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '60%',
    height: '80%',
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

export default function ImageModal({open, onClose, expense, getExpense }: ImageModalProps) {    
    const handleFileChange = (event: any) => {
        const jwt = localStorage.getItem("jwtToken");
        if (!jwt) {
          return;
        }
        const file = event.target.files[0];
        if (file) {
          const form = new FormData();
          form.append("expense_id", expense.id)
          form.append("image", file);
    
          fetch(`${API_URL}/expenses/image`, {
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
                <Box display='flex' flex='0.3' flexDirection='column' width='100%' justifyContent='center' alignItems='center' sx={{backgroundColor: 'blue'}}>
                <ThemeProvider theme={modalTheme}>
                    <Typography color='white'>Imagen del gasto</Typography>
                    </ThemeProvider>
                </Box>    
                <Box
                    component="img"
                    sx={{
                    height: '58%',
                    width: '58%',
                    marginBottom: '1%',
                    marginTop: '1%'
                    }}
                    alt="The house from the offer."
                    src={expense.image_link}
                />    
                <Box display='flex' flex='1' width='100%' flexDirection='row' justifyContent='flex-end' sx={{mr: '5%'}}>
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