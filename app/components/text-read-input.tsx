export default function TextReadInput({
  name,
  label,
  value,
  placeholder,
  onChange,
}: InputProps) {
  return (
    <>
      <label
        htmlFor={name}
        className="block text-sm font-semibold text-slate-700 dark:text-slate-400"
      >
        {label}
      </label>
      <div className="mt-1">
        <input
          type="text"
          name={name}
          id={name}
          defaultValue={value}
          onChange={onChange}
          className="block w-full rounded-md border-slate-300 focus:border-indigo-500 focus:ring-indigo-500 dark:bg-slate-800 dark:text-slate-50 sm:text-sm p-1"
          placeholder={placeholder}
        />
      </div>
    </>
  );
}
