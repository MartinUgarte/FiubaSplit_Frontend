"use client";

import { useEffect, useState } from 'react'
import GroupCard from './GroupCard'
import { Box, Button, Grid } from '@mui/material'
import { Group, dumpGroup } from '@/app/types';
import CreateGroupModal from './CreateGroupModal';

type FormValues = {
    name: string;
    description: string;
}

export default function GroupsHome() {
    const [groups, setGroups] = useState<Group[]>([dumpGroup]);
    const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);

    useEffect(() => {
        getGroups()
    }, [])

    const getGroups = () => {
        // const jwt = localStorage.getItem('jwtToken');

        // fetch(`http://localhost:8000/groups`, {
        //     method: 'GET',
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'Authorization': `Bearer ${jwt}`
        //     }
        // })
        //     .then((res) => {
        //         if (!res.ok) {
        //             throw new Error('Network response was not ok');
        //         }
        //         return res.json()
        //     })
        //     .then((data) => {
        //         console.log("Got groups: ", data)
        //         setGroups(data.map((group: Groups) => {
        //             return {
        //                 id: group.id,
        //                 name: group.name,
        //                 description: group.description,
        //             }
        //         }))
        //     })

    }

    return (
        <Box display='flex' flex='1' flexDirection='column'>
            <CreateGroupModal open={showCreateGroupModal} onClose={() => setShowCreateGroupModal(false)} getGroups={() => getGroups()} />
            <Box display='flex' flex='0.1' justifyContent='flex-end'>
                <Button
                    variant="outlined"
                    sx={{ height: 40 }}
                    onClick={() => setShowCreateGroupModal(true)}
                >
                    Create group
                </Button>
            </Box>
            <Box display='flex' flex='0.9'>
                <Grid container spacing={5} sx={{ marginTop: 1 }}>
                    {groups.map((group) => (
                        <Grid item xs={6} key={group.id}>
                            <GroupCard
                                id={group.id}
                                name={group.name}
                                description={group.description}
                                getGroups={() => getGroups()}
                            />
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Box>
    )
}
