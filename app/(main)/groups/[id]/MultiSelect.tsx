import React, { useState } from "react";
import {
  Stack,
  OutlinedInput,
  InputLabel,
  MenuItem,
  Chip,
  Select,
  FormControl,
  Autocomplete,
  TextField,
  SelectChangeEvent
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CancelIcon from "@mui/icons-material/Cancel";

type MultiSelectProps = {
    selectedParticipants: string[];
  setSelectedParticipants: (creditors: string[]) => void;
  names: string[];
  text: string;
}

export default function MultiSelect ({selectedParticipants, setSelectedParticipants, names, text}: MultiSelectProps ) {
  
    const handleChange = (event: SelectChangeEvent<typeof selectedParticipants>) => {
      const value = event.target.value as string[];
      setSelectedParticipants(value);
    };

    return (
      <FormControl sx={{ m: 1, width: '100%', marginTop: 2 }}>
        <InputLabel>{text}</InputLabel>
        <Select
          multiple
          value={selectedParticipants}
          onChange={handleChange}
          input={<OutlinedInput label="Multiple Select" />}
          renderValue={(selected) => (
            <Stack gap={1} direction="row" flexWrap="wrap">
              {selected.map((value) => (
                <Chip
                  key={value}
                  label={value}
                  onDelete={() =>
                    setSelectedParticipants(
                        selectedParticipants.filter((item) => item !== value)
                    )
                  }
                  deleteIcon={
                    <CancelIcon
                      onMouseDown={(event) => event.stopPropagation()}
                    />
                  }
                />
              ))}
            </Stack>
          )}
        >
          {names.map((name) => (
            <MenuItem
              key={name}
              value={name}
              sx={{ justifyContent: "space-between" }}
            >
              {name}
              {selectedParticipants.includes(name) ? <CheckIcon color="info" /> : null}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  };