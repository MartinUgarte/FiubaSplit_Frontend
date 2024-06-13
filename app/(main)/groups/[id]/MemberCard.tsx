import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { Box, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect, useState } from "react";
import LoadingModal from "app/LoadingModal";
import GppGoodIcon from '@mui/icons-material/GppGood';

import CustomModal from "app/CustomModal";
import { Group } from "app/types";
import StarIcon from '@mui/icons-material/Star';

type MemberCardProps = {
    memberId: string;
    creatorId: string;
    getGroup: () => void;
    group: Group,
};

export default function MemberCard({
    memberId,
    creatorId,
    getGroup,
    group
}: MemberCardProps) {
    const [memberName, setMemberName] = useState("");
    const [showLoading, setShowLoading] = useState(false);
    const [showConfirmationModal, setShowConfirmationModal] = useState(false)

    useEffect(() => {
        getUser();
    }, []);

    const checkMemberIsNotAdmin = () => {
        return !group.admins.includes(memberId)
    }

    const checkAdmin = () => {
        const userId = localStorage.getItem('userId')
        if (userId) {
            return group.admins.includes(userId)
        }
        return false
    }

    const checkMe = () => {
        return localStorage.getItem("userId") != memberId
    }

    const makeAdmin = () => {
        const jwt = localStorage.getItem("jwtToken");
        const groupId = localStorage.getItem("groupId");
        if (!jwt || !groupId) {
            return;
        }

        fetch(`${process.env.NEXT_PUBLIC_API_URL}/groups/${groupId}/add-admin/${memberId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwt}`,
            },
        }).then((res) => {
            console.log(res)
            getGroup()
            setShowConfirmationModal(true)
        });
    };

    const handleDeleteMember = () => {
        const jwt = localStorage.getItem("jwtToken");
        const groupId = localStorage.getItem("groupId");
        if (!jwt || !groupId) {
            return;
        }
        setShowLoading(true);

        fetch(`${process.env.NEXT_PUBLIC_API_URL}/groups/${groupId}/delete-member/${memberId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwt}`,
            },
        }).then((res) => {
            console.log(res)
            getGroup();
            setShowLoading(false);
        });
    };

    const getUser = () => {
        const jwt = localStorage.getItem("jwtToken");
        if (!jwt) {
            return;
        }
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${memberId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwt}`,
            },
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Network response was not ok");
                }
                return res.json();
            })
            .then((data) => {
                console.log("Got user: ", data);
                setMemberName(data.name);
            });
    };

    const checkCreator = () => {
        return group.creator_id == memberId
    }

    return (
        <Card>
            <CardContent>
                <Box
                    display="flex"
                    flex="1"
                    justifyContent="space-between"
                    alignItems="center"
                    flexDirection="row"
                >
                    <LoadingModal
                        open={showLoading}
                        onClose={() => setShowLoading(false)}
                    />
                    <CustomModal
                        open={showConfirmationModal}
                        onClick={() => setShowConfirmationModal(false)}
                        onClose={() => setShowConfirmationModal(false)}
                        text={`Has añadido como admin a ${memberName}`}
                        buttonText="OK"
                    />
                    <Box
                        display="flex"
                        flex="0.5"
                        justifyContent="flex-start"
                        alignItems="center"
                    >
                        <Typography color="black" variant="h5">
                            {memberName}
                        </Typography>
                    </Box>
                    <Box
                        display="flex"
                        flex="0.5"
                        justifyContent="flex-end"
                        alignItems="center"
                    >
                        {checkAdmin() && checkMe() && checkMemberIsNotAdmin() && (
                            <Box>
                                <IconButton color="primary" onClick={() => handleDeleteMember()}>
                                    <DeleteIcon />
                                </IconButton>
                                {checkMemberIsNotAdmin() && <IconButton color="primary" onClick={() => makeAdmin()}>
                                    <GppGoodIcon />
                                </IconButton>}
                            </Box>
                        )}
                        {checkCreator() && (<StarIcon color="primary" />)}
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
}
