import { Box, Typography, Button, Divider, ThemeProvider } from '@mui/material';
import Modal from '@mui/material/Modal';
import MemberCard from './MemberCard';
import { Group } from 'app/types';
import { modalTheme } from 'app/fonts';

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: "40%",
    height: '70%',
    bgcolor: 'background.paper',
    boxShadow: 5,
};

type MembersModalProps = {
    open: boolean,
    onClose: () => void,
    group: Group,
    getGroup: () => void,
}


export default function MembersModal({ open, onClose, group, getGroup}: MembersModalProps) {

    return (
        <Modal
            open={open}
            onClose={() => onClose()}
        >
            <Box display='flex' flex='1' flexDirection='column' justifyContent='center' alignItems='center' sx={style} >
                <Box display='flex' flex='0.2' flexDirection='column' width='100%' justifyContent='center' alignItems='center' sx={{ backgroundColor: 'blue' }}>
                <ThemeProvider theme={modalTheme}>
                    <Typography color='white'>Miembros</Typography>
                    </ThemeProvider>
                </Box>

                <Box display='flex' flex='0.8' justifyContent='center' alignItems='center' flexDirection="column" width='100%'>
                    <Box width='100%' display='flex' flexDirection='column' alignItems='center' sx={{ maxHeight: '300px', overflowY: 'auto' }}>
                        {group.members.map((member, index) => (
                            <Box key={member} width='90%'>
                                <MemberCard
                                    memberId={member}
                                    creatorId={group.creator_id}
                                    getGroup={getGroup}
                                />
                                {index < group.members.length - 1 && <Divider sx={{ marginBottom: 2, marginX: 10 }} />}
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
