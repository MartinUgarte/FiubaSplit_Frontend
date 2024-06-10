import { Box, Typography, Button, Divider, ThemeProvider, IconButton } from '@mui/material';
import Modal from '@mui/material/Modal';
import { Group } from 'app/types';
import { modalTheme } from 'app/fonts';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import CustomModal from 'app/CustomModal';
import { useState } from 'react';
import LoadingModal from 'app/LoadingModal';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import { API_URL } from 'app/constants';

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: "50%",
    height: "70%",
    bgcolor: 'background.paper',
    boxShadow: 5,
};

type BalanceModalProps = {
    open: boolean,
    onClose: () => void,
    memberId: string,
    members: { [key: string]: string },
    balance: { [key: string]: number },
    expenseId: string,
    getExpense: () => void
}


export default function BalanceModal({ open, onClose, memberId, members, balance, expenseId, getExpense }: BalanceModalProps) {
    const [showLoading, setShowLoading] = useState(false);
    const [showCustomModal, setShowCustomModal] = useState(false);
    const [showDebtConfirmationModal, setShowDebtConfirmationModal] = useState(false);
    
    const sendNotification = (debtorId: string) => {
        const jwt = localStorage.getItem("jwtToken");
        if (!jwt) {
          return;
        }
        setShowLoading(true);
        fetch(`${API_URL}/expenses/send-reminder`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`,
          },
          body: JSON.stringify({
            expense_id: expenseId,
            debtor_id: debtorId,
            link_to_debt: 'http://localhost:3000/login'

          }),
        })
          .then((res) => {
            return res.json();
          })
          .then((data) => {
            console.log("Got data from notification sent: ", data);
            setShowCustomModal(true)
            setShowLoading(false);
          });
      };
    
      const cancelDebt = (id: string) => {
        const jwt = localStorage.getItem("jwtToken");
        fetch(`${API_URL}/cancel-debt/${expenseId}/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`,
          },
        })
          .then((res) => {
            console.log(res);
            return res.json();
          })
          .then((data) => {
              console.log('Elimine deuda: ', data)
              getExpense()
              setShowDebtConfirmationModal(true)
              
          });
      };

    const balanceText = (other_id: string) => {
        const balance_other: number = balance[other_id];
        const other_name = members[other_id];
        const my_name = members[memberId];
        if (balance_other > 0) {
            return (
                <Box display='flex' flexDirection='row' justifyContent='space-between' alignItems='center'>
                    <Box display='flex' flexDirection='row' sx={{ bgColor: 'blue' }}>
                        {memberId == localStorage.getItem('userId') ? (
                            <Box flexDirection='row' display='flex' justifyContent='center' alignItems='center'>
                                <Box flexDirection='row' display='flex' justifyContent='center' alignItems='center'>
                                    <Typography sx={{ fontSize: 15, fontWeight: 'bold', marginRight: 0.5 }}>{other_name}</Typography>
                                    <Typography sx={{ fontSize: 15, marginRight: 0.5 }}>te debe</Typography>
                                    <Typography sx={{ fontSize: 15, color: 'green', marginRight: 0.5 }}>${balance_other.toFixed(2)}</Typography>
                                </Box>
                            </Box>
                        ) : other_id == localStorage.getItem('userId') ? (
                            <>
                                <Typography sx={{ fontSize: 15, fontWeight: 'bold', marginRight: 0.5 }}>Le debes</Typography>
                                <Typography sx={{ fontSize: 15, marginRight: 0.5, color: 'red' }}>${balance_other.toFixed(2)}</Typography>
                                <Typography sx={{ fontSize: 15, marginRight: 0.5 }}>a</Typography>
                                <Typography sx={{ fontSize: 15, fontWeight: 'bold' }}>{my_name}</Typography>
                            </>
                        ) : (
                            <>
                                <Typography sx={{ fontSize: 15, fontWeight: 'bold', marginRight: 0.5 }}>{other_name}</Typography>
                                <Typography sx={{ fontSize: 15, marginRight: 0.5 }}>le debe</Typography>
                                <Typography sx={{ fontSize: 15, marginRight: 0.5 }}>${balance_other.toFixed(2)}</Typography>
                                <Typography sx={{ fontSize: 15, marginRight: 0.5 }}>a</Typography>
                                <Typography sx={{ fontSize: 15, fontWeight: 'bold' }}>{my_name}</Typography>
                            </>
                        )}
                    </Box>
                    <Box flexDirection='row' display='flex' alignItems='center' justifyContent='flex-end'>
                        {memberId == localStorage.getItem('userId') && (<IconButton color="primary" onClick={() => sendNotification(other_id)} sx={{ marginLeft: '2%' }}>
                            <NotificationsActiveIcon />
                        </IconButton>)}
                        {other_id == localStorage.getItem('userId') && (<Button startIcon={<PointOfSaleIcon />} variant="contained" onClick={() => cancelDebt(memberId)}>
                                    Pagar
                                </Button> )}

                        
                    </Box>
                </Box>
            );
        } else if (balance_other < 0) {
            return (
                <Box display='flex' flexDirection='row' justifyContent='space-between' alignItems='center'>
                    <Box display='flex' flexDirection='row'>
                        {memberId == localStorage.getItem('userId') ? (
                            <>
                                <Typography sx={{ fontSize: 15, fontWeight: 'bold', marginRight: 0.5 }}>Le debes</Typography>
                                <Typography sx={{ fontSize: 15, color: 'red', marginRight: 0.5 }}>${(balance_other * -1).toFixed(2)}</Typography>
                                <Typography sx={{ fontSize: 15, marginRight: 0.5 }}>a</Typography>
                                <Typography sx={{ fontSize: 15, fontWeight: 'bold' }}>{other_name}</Typography>
                            </>
                        ) : other_id == localStorage.getItem('userId') ? (
                            <>
                                <Typography sx={{ fontSize: 15, fontWeight: 'bold', marginRight: 0.5 }}>{my_name}</Typography>
                                <Typography sx={{ fontSize: 15, marginRight: 0.5 }}>te debe</Typography>
                                <Typography sx={{ fontSize: 15, color: 'green' }}>${(balance_other * -1).toFixed(2)}</Typography>
                            </>
                        ) : (
                            <>
                                <Typography sx={{ fontSize: 15, fontWeight: 'bold', marginRight: 0.5 }}>{my_name}</Typography>
                                <Typography sx={{ fontSize: 15, marginRight: 0.5 }}>le debe</Typography>
                                <Typography sx={{ fontSize: 15, marginRight: 0.5 }}>${(balance_other * -1).toFixed(2)}</Typography>
                                <Typography sx={{ fontSize: 15, marginRight: 0.5 }}>a</Typography>
                                <Typography sx={{ fontSize: 15, fontWeight: 'bold' }}>{other_name}</Typography>
                            </>
                        )}
                    </Box>
                    <Box flexDirection='row' display='flex' alignItems='center' justifyContent='flex-end'>
                        {other_id == localStorage.getItem('userId') && (<IconButton color="primary" onClick={() => sendNotification(memberId)} sx={{ marginLeft: '2%' }}>
                            <NotificationsActiveIcon />
                        </IconButton>)}
                        {memberId == localStorage.getItem('userId') && (<Button startIcon={<PointOfSaleIcon />} variant="contained" onClick={() => cancelDebt(other_id)}>
                                    Pagar
                                </Button> )}
                    </Box>
                </Box>
            );
        }
    }

    const confirmCancelDebt = () => {
        setShowDebtConfirmationModal(false)
        onClose()
        window.location.reload();
    }

    return (
        <Modal
            open={open}
            onClose={() => onClose()}
        >
            <Box display='flex' flex='1' flexDirection='column' justifyContent='center' alignItems='center' sx={style} >
            <CustomModal
            open={showCustomModal}
            onClose={() => setShowCustomModal(false)}
            onClick={() => setShowCustomModal(false)}
            text='Notificacion Enviada'
            buttonText='Ok'
            />
            <CustomModal
            open={showDebtConfirmationModal}
            onClose={() => confirmCancelDebt()}
            onClick={() => confirmCancelDebt()}
            text='Deuda pagada'
            buttonText='Ok'
            />
            <LoadingModal open={showLoading} onClose={() => setShowLoading(false)} />
                <Box display='flex' flex='0.2' flexDirection='column' width='100%' justifyContent='center' alignItems='center' sx={{ backgroundColor: 'blue' }}>
                    <ThemeProvider theme={modalTheme}>
                        <Typography color='white'>Balance de {members[memberId]}</Typography>
                    </ThemeProvider>

                </Box>

                <Box display='flex' flex='0.8' justifyContent='center' alignItems='center' flexDirection="column" width='100%'>
                    <Box width='100%' display='flex' flexDirection='column' alignItems='center' sx={{ maxHeight: '300px', overflowY: 'auto' }}>
                        {Object.keys(members).map((member_id, index) => (
                            <Box key={member_id} width='90%' marginBottom={index < Object.keys(members).length - 1 ? 2 : 0}>
                                {memberId !== member_id && balanceText(member_id)}
                                {memberId !== member_id && index < Object.keys(members).length - 1 && <Divider sx={{ mt: 2, color: 'white', height: '3px' }} />}
                            </Box>

                        ))}
                    </Box>
                </Box>
                <Box display='flex' flex='0.2' >
                    <Button
                        variant="contained"
                        sx={{ mb: 2, height: 45, width: '100%' }}
                        onClick={onClose}
                    >
                        Cerrar
                    </Button>
                </Box>
            </Box>
        </Modal>
    )

}
