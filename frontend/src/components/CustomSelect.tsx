/** @jsxImportSource @emotion/react */

import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

type Option = {
  name: string;
  value: string;
};

type Props = {
  label: string;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
};

function CustomSelect(props: Props) {
  const { label, value, onChange, options, disabled } = props;

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
          <MenuItem value={option.value}>{option.name}</MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default CustomSelect;
