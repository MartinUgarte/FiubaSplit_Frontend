import { Box, Typography, Button, Divider, ThemeProvider, IconButton } from '@mui/material';
import Modal from '@mui/material/Modal';
import { Group } from '@/app/types';
import { modalTheme } from '@/app/fonts';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    height: 400,
    bgcolor: 'background.paper',
    boxShadow: 5,
};

type BalanceModalProps = {
    open: boolean,
    onClose: () => void,
    memberId: string,
    members: {[key: string]: string},
    balance: {[key: string]: number},
    isBalanced: boolean
}


export default function BalanceModal({ open, onClose, memberId, members, balance, isBalanced}: BalanceModalProps) {

    const balanceText = (memberName: string, balance: number) => {

        if (balance > 0) {
            return (
                <Box display='flex' flexDirection='row' justifyContent='space-between' alignItems='center'>
                    <Box display='flex' flexDirection='row'>
                        {memberId == localStorage.getItem('userId') ? (  
                            <> 
                             <Typography sx={{ fontSize: 15, fontWeight: 'bold', marginRight: 0.5 }}>{memberName}</Typography>
                             <Typography sx={{fontSize: 15, marginRight: 0.5}}>te debe</Typography>
                             <Typography sx={{fontSize: 15, color: 'green', marginRight: 0.5}}>${balance.toFixed(2)}</Typography>
                             </>
                        ) : (
                            <>
                            <Typography sx={{ fontSize: 15, fontWeight: 'bold', marginRight: 0.5 }}>{memberName}</Typography>
                            <Typography sx={{fontSize: 15, marginRight: 0.5}}>le debe</Typography>
                            <Typography sx={{fontSize: 15, marginRight: 0.5}}>${balance.toFixed(2)}</Typography>
                            <Typography sx={{fontSize: 15, marginRight: 0.5}}>a</Typography>
                            <Typography sx={{fontSize: 15, fontWeight: 'bold'}}>{members[memberId]}</Typography>
                            </>
                        )}
                    </Box>
                    <Box>
                        {memberId == localStorage.getItem('userId') && ( <IconButton color="primary" onClick={() => console.log('aa')} sx={{marginLeft:'2%'}}>
                            <NotificationsActiveIcon />
                        </IconButton>)}
                    </Box>   
                </Box>
            );
        } else if (balance < 0) {
            return (
                <Box display='flex' flexDirection='row'>
                {memberId == localStorage.getItem('userId') ? (  
                            <> 
                             <Typography sx={{fontSize: 15, marginRight: 0.5}}>Debes</Typography>
                             <Typography sx={{fontSize: 15, color: 'red', marginRight: 0.5}}>${(balance * -1).toFixed(2)}</Typography>
                             <Typography sx={{fontSize: 15, marginRight: 0.5}}>a</Typography>
                             <Typography sx={{fontSize: 15, fontWeight: 'bold'}}>{memberName}</Typography>
                             </>
                        ) : (
                            <>
                            <Typography sx={{ fontSize: 15, fontWeight: 'bold', marginRight: 0.5 }}>{members[memberId]}</Typography>
                            <Typography sx={{fontSize: 15, marginRight: 0.5}}>le debe</Typography>
                            <Typography sx={{fontSize: 15, marginRight: 0.5}}>${(balance * -1).toFixed(2)}</Typography>
                            <Typography sx={{fontSize: 15, marginRight: 0.5}}>a</Typography>
                            <Typography sx={{fontSize: 15, fontWeight: 'bold'}}>{memberName}</Typography>
                            </>
                        )}
                
                </Box>
            );
        }
    }

    return (
        <Modal
            open={open}
            onClose={() => onClose()}
        >
            <Box display='flex' flex='1' flexDirection='column' justifyContent='center' alignItems='center' sx={style} >
                <Box display='flex' flex='0.2' flexDirection='column' width='100%' justifyContent='center' alignItems='center' sx={{ backgroundColor: 'blue' }}>
                <ThemeProvider theme={modalTheme}>
                <Typography color='white'>Balance de {members[memberId]}</Typography>
                    </ThemeProvider>
                    
                </Box>

                <Box display='flex' flex='0.8' justifyContent='center' alignItems='center' flexDirection="column" width='100%'>
                    <Box width='100%' display='flex' flexDirection='column' alignItems='center' sx={{ maxHeight: '300px', overflowY: 'auto' }}>
                        
                        {isBalanced ? (
                            <Typography>Todo balanceado</Typography>
                        ) : (
                            <>
                            {Object.keys(members).map((member_id, index) => (
                            <Box key={member_id} width='90%' marginBottom={index < Object.keys(members).length - 1 ? 2 : 0}>
                                {memberId !== member_id && balanceText(members[member_id], balance[member_id])}
                                {memberId !== member_id && index < Object.keys(members).length - 1 && <Divider sx={{ mt: 2, color: 'white', height: '3px' }} />}
                            </Box>
                            
                        ))}
                        </>
                    )}
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
