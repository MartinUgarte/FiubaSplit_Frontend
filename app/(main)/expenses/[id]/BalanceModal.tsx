import { Box, Typography, Button, Divider } from '@mui/material';
import Modal from '@mui/material/Modal';
import { Group } from '@/app/types';

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 700,
    height: 600,
    bgcolor: 'background.paper',
    boxShadow: 5,
};

type BalanceModalProps = {
    open: boolean,
    onClose: () => void,
    memberId: string,
    members: {[key: string]: string},
    balance: {[key: string]: number},
}


export default function BalanceModal({ open, onClose, memberId, members, balance}: BalanceModalProps) {

    return (
        <Modal
            open={open}
            onClose={() => onClose()}
        >
            <Box display='flex' flex='1' flexDirection='column' justifyContent='center' alignItems='center' sx={style} >
                <Box display='flex' flex='0.2' flexDirection='column' width='100%' justifyContent='center' alignItems='center' sx={{ backgroundColor: 'blue' }}>
                    <Typography color='white'>Miembros</Typography>
                </Box>

                <Box display='flex' flex='0.8' justifyContent='center' alignItems='center' flexDirection="column" width='100%'>
                    <Box width='100%' display='flex' flexDirection='column' alignItems='center' sx={{ maxHeight: '300px', overflowY: 'auto' }}>
                        {Object.keys(members).map((member_id) => (
                            <Box key={member_id} width='90%'>
                                {memberId != member_id && <Typography>{members[member_id]}  balance:   {balance[member_id]}</Typography>}
                                {/* <MemberCard
                                    memberId={member}
                                    creatorId={group.creator_id}
                                    getGroup={getGroup}
                                /> */}
                                 {/* {index < group.members.length - 1 && <Divider sx={{ marginBottom: 2, marginX: 10 }} />} */}
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
