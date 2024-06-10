"use client";

import { useEffect, useState } from "react";
import GroupCard from "./GroupCard";
import { Box, Button, Grid } from "@mui/material";
import { Filters, Group, defaultFilters, dumpGroup } from "app/types";
import CreateGroupModal from "./CreateGroupModal";
import GroupFilterModal from "./GroupFilterModal";
import AddIcon from '@mui/icons-material/Add';
import { API_URL } from "app/constants";

type FormValues = {
  name: string;
  description: string;
};

export default function GroupsHome() {
  const [groups, setGroups] = useState<Group[]>([dumpGroup]);
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilters, setSelectedFilters] =
    useState<Filters>(defaultFilters);

  useEffect(() => {
    setSelectedFilters(defaultFilters)
    getGroups();
  }, []);

  const submitFilters = () => {
    console.log('FILTROS SELECCIONAOS: ', selectedFilters);
    setSelectedFilters(defaultFilters);
    getGroups();
    setShowFilters(false);
  };

  const checkMember = (group: Group) => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      return group.members.includes(userId);
    }
    console.log("El item del local storage userId es null");
    return false;
  };

  const getGroups = () => {
    const jwt = localStorage.getItem("jwtToken");

    const nameParam = selectedFilters.name ? selectedFilters.name : '';
    const descriptionParam = selectedFilters.description ? selectedFilters.description : '';
    const categoryParam = selectedFilters.category ? selectedFilters.category : '';
    
    const paramsArray: [string, string | undefined][] = [
      ['name', nameParam],
      ['description', descriptionParam],
      ['category', categoryParam],
    ];

    const filteredParams = paramsArray.filter(([_, value]) => value !== '');

    const queryParams = new URLSearchParams(filteredParams as unknown as string[][]);
    console.log('queryParams: ', queryParams.toString())

    fetch(`${API_URL}/groups?${queryParams.toString()}`, {
    // fetch(`${API_URL}/groups`, {
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
        console.log("Got groups: ", data);
        setGroups(
          data.map((group: Group) => {
            return {
              id: group.id,
              name: group.name,
              description: group.description,
              creator_id: group.creator_id,
              category: group.category,
              members: group.members,
            };
          })
        );
      });
  };

  return (
    <Box display="flex" flex="1" flexDirection="column">
      <CreateGroupModal
        open={showCreateGroupModal}
        onClose={() => setShowCreateGroupModal(false)}
        getGroups={() => getGroups()}
      />
      <GroupFilterModal
        open={showFilters}
        onClose={() => setShowFilters(false)}
        selectedFilters={selectedFilters}
        setSelectedFilters={setSelectedFilters}
        submitFilters={() => submitFilters()}
      />
      <Box display="flex" flex="0.1" justifyContent="flex-end">
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{ height: 40}}
          onClick={() => setShowCreateGroupModal(true)}
        >
          Grupo
        </Button>
        <Button
          variant="text"
          sx={{ height: 40, marginLeft: 2 }}
          onClick={() => setShowFilters(true)}
        >
          Filtrar
        </Button>
      </Box>
      <Box display="flex" flex="0.9">
        <Grid container spacing={5} sx={{ marginTop: 1 }}>
          {groups.map(
            (group) =>
              checkMember(group) && (
                <Grid item xs={6} key={group.id}>
                  <GroupCard group={group} getGroups={() => getGroups()} />
                </Grid>
              )
          )}
        </Grid>
      </Box>
    </Box>
  );
}
