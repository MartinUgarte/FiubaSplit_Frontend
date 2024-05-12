import * as React from 'react';
import Image from 'next/image';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useRouter } from 'next/navigation';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box } from '@mui/material';
import { useState } from 'react';
import EditGroupModal from './EditGroupModal';
import CustomModal from '@/app/CustomModal';

export default function GroupCard({ name, id, description, getGroups }: { name: string; description: string, id: number, getGroups: () => void }) {
    const router = useRouter();
    const [showEditGroupModal, setShowEditGroupModal] = useState(false);
    const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] = useState(false);

    const handleDetails = () => {
        //localStorage.setItem('groupId', id.toString());
        //router.push(`group/${id}`)
    }

    const handleDelete = () => {
        // const jwt = localStorage.getItem("jwtToken");
        // fetch(`http://localhost:8000/groups/${id}`, {
        //     method: 'DELETE',
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'Authorization': `Bearer ${jwt}`
        //     },
        // }).then((res) => {
        //     getGroups();
        // })
        setShowDeleteConfirmationModal(false)
    }

    return (
        <Card style={{ borderTop: '2px solid blue' }}>
            <EditGroupModal open={showEditGroupModal} onClose={() => setShowEditGroupModal(false)} getGroups={() => getGroups()} id={id} />
            {showDeleteConfirmationModal && (<CustomModal open={showDeleteConfirmationModal} onClick={() => handleDelete()} onClose={() => setShowDeleteConfirmationModal(false)} text="Confirm delete" buttonText='Confirm'/>)}
            <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                    {name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {description}
                </Typography>
            </CardContent>
            <CardActions>
                <Box
                    display="flex"
                    flex="1"
                    flexDirection="row"
                    justifyContent="center"
                >
                    <Box
                        display="flex"
                        flex="0.5"
                        flexDirection="row"
                        justifyContent="left"
                    >
                        <Button size="small" onClick={() => setShowEditGroupModal(true)}>Edit</Button>
                        <Button size="small" onClick={() => handleDetails()}>Group details</Button>
                    </Box>
                    <Box
                        display="flex"
                        flex="0.5"
                        flexDirection="row"
                        justifyContent="right"
                    >
                        <IconButton color="primary" onClick={() => setShowDeleteConfirmationModal(true)}>
                            <DeleteIcon />
                        </IconButton>
                    </Box>
                </Box>
            </CardActions>

        </Card>
    );
}