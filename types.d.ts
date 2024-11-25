type InputProps = {
  name?: string;
  label?: string;
  value?: string;
  type?: string;
  checked?: boolean;
  description?: string;
  placeholder?: string;
  addon?: string;
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
  handleChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCheckboxChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSwitch?: (checked: boolean) => void;
};

type neonUser = [
  {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    prefix: string;
    suffix: string;
    mobile: string;
    telephone: string;
    created_at: string;
    updated_at: string;
    user_role: string;
    email_verified: boolean;
    avatar: string;
    clerk_user_id: string;
  }
];
