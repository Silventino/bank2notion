/** @jsxImportSource @emotion/react */

import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

type Option = {
  name: string;
  value: string;
};

type Props<T> = {
  label: string;
  options: T[];
  getOptionLabel: (option: T) => string;
  getOptionValue: (option: T) => string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
};

function CustomSelect<T = Option>(props: Props<T>) {
  const {
    label,
    value,
    onChange,
    options,
    disabled,
    getOptionLabel,
    getOptionValue,
  } = props;

  return (
    <FormControl fullWidth>
      <InputLabel>{label}</InputLabel>
      <Select
        value={value}
        label={label}
        onChange={(event) => {
          onChange(event.target.value as string);
        }}
        disabled={disabled}
      >
        {options.map((option) => (
          <MenuItem key={getOptionValue(option)} value={getOptionValue(option)}>
            {getOptionLabel(option)}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default CustomSelect;
