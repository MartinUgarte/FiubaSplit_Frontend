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
  SelectChangeEvent,
  FormHelperText
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CancelIcon from "@mui/icons-material/Cancel";

type MultiSelectProps = {
  selectedPayersNames: string[];
  setSelectedPayersNames: (creditors: string[]) => void;
  names: string[];
  text: string;
  continueButtonPressed: boolean
}

export default function MultiSelect ({selectedPayersNames, setSelectedPayersNames, names, text, continueButtonPressed}: MultiSelectProps ) {
  
    const handleChange = (event: SelectChangeEvent<typeof selectedPayersNames>) => {
      const value = event.target.value as string[];
      setSelectedPayersNames(value);
    };

    return (
      <FormControl sx={{ m: 1, width: '100%', marginTop: 2 }} error={continueButtonPressed && selectedPayersNames.length === 0}>
        <InputLabel>{text}</InputLabel>
        <Select
          multiple
          value={selectedPayersNames}
          onChange={handleChange}
          input={<OutlinedInput label="Multiple Select" />}
          renderValue={(selected) => (
            <Stack gap={1} direction="row" flexWrap="wrap">
              {selected.map((value) => (
                <Chip
                  key={value}
                  label={value}
                  onDelete={() =>
                    setSelectedPayersNames(
                      selectedPayersNames.filter((item) => item !== value)
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
              {selectedPayersNames.includes(name) ? <CheckIcon color="info" /> : null}
            </MenuItem>
          ))}
        </Select>
        {continueButtonPressed && selectedPayersNames.length === 0 && <FormHelperText color='red'>Ingresa al menos un pagador</FormHelperText>}
      </FormControl>
    );
  };