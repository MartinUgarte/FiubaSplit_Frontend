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
import { Group } from '@/app/types';


type GroupCardProps = {
    group: Group;
    getGroups: () => void;

}

export default function GroupCard({ group, getGroups}: GroupCardProps) {
    const router = useRouter();
    const [showEditGroupModal, setShowEditGroupModal] = useState(false);
    const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false)

    const handleDetails = () => {
        console.log('ID: ', group.id);
        localStorage.setItem('groupId', group.id.toString());
        router.push(`groups/${group.id}`)
      }
    

    const handleDelete = () => {
        setShowDeleteConfirmationModal(false)
        const jwt = localStorage.getItem("jwtToken");
        fetch(`http://localhost:8000/groups/${group.id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwt}`
            },
        }).then((res) => {
            if (res.status == 200) {
                getGroups();
            }
            if (res.status == 403) {
                console.log(res)
                setShowErrorModal(true)
                //return
            }
        })
    }

    const checkAdmin = () => {
        return localStorage.getItem('userId') == group.creator_id
    }

    return (
        <Card style={{ borderTop: '2px solid blue' }}>
            <EditGroupModal open={showEditGroupModal} onClose={() => setShowEditGroupModal(false)} getGroups={() => getGroups()} group={group} />
            <CustomModal open={showErrorModal} onClick={() => setShowErrorModal(false)} onClose={() => setShowErrorModal(false)} text="No se puede eliminar este grupo porque tiene deudas pendientes" buttonText='Ok'/>
            {showDeleteConfirmationModal && (<CustomModal open={showDeleteConfirmationModal} onClick={() => handleDelete()} onClose={() => setShowDeleteConfirmationModal(false)} text="Confirm delete" buttonText='Confirm'/>)}
            <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                    {group.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {group.description}
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
                        {checkAdmin() && <Button size="small" onClick={() => setShowEditGroupModal(true)}>Edit</Button>}
                        <Button size="small" onClick={() => handleDetails()}>Ver más</Button>
                    </Box>
                    <Box
                        display="flex"
                        flex="0.5"
                        flexDirection="row"
                        justifyContent="right"
                    >
                        {checkAdmin() && <IconButton color="primary" onClick={() => setShowDeleteConfirmationModal(true)}>
                            <DeleteIcon />
                        </IconButton>}
                    </Box>
                </Box>
            </CardActions>

        </Card>
    );
}