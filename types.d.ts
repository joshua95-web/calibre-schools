type InputProps = {
  name?: string;
  label?: string;
  value?: string;
  type?: string;
  checked?: boolean;
  description?: string;
  placeholder?: string;
  addon?: string;
  handleChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCheckboxChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSwitch?: (checked: boolean) => void;
};

