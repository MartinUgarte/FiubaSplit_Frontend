import React from "react";
import { useForm, Controller } from "react-hook-form";
import TextField, { FilledTextFieldProps, OutlinedTextFieldProps, StandardTextFieldProps, TextFieldVariants } from "@mui/material/TextField";
import DatePicker from "@mui/lab/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

export interface FormDatePickerProps {
    name: string;
    label: string;
    control: any;
    defaultValue?: any;
  
  }
  
  function FormDatePicker({
    name,
    label,
    control,
    defaultValue,
  }: FormDatePickerProps) {
    return (
      <Controller
        control={control}
        name={name}
        defaultValue={defaultValue ?? null}
        render={({ field: { onChange, value, ref }, fieldState }) => (
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              onChange={onChange}
              value={value}
              label={label}
              ref={ref}
              
              renderInput={(params: React.JSX.IntrinsicAttributes & { variant?: TextFieldVariants | undefined; } & Omit<FilledTextFieldProps | OutlinedTextFieldProps | StandardTextFieldProps, "variant">) => (
                <TextField
                  sx={{ width: '100%' }}
                  {...params}
                  error={Boolean(fieldState.error)}
                  helperText={fieldState?.error?.message}
                />
              )}
            />
          </LocalizationProvider>
        )}
      />
    );
  }
  
  export default FormDatePicker;