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
        className="block text-sm font-semibold text-slate-100 dark:text-slate-200"
      >
        {label}
      </label>
      <div className="mt-1">
        <input
          type="text"
          name={name}
          id={name}
          defaultValue={value}
          value={value}
          onChange={onChange}
          className="block w-full rounded-md border-indigo-300 focus:border-amber-500 focus:ring-amber-500 bg-slate-50 dark:bg-slate-100 text-slate-900 dark:text-slate-600 sm:text-sm p-1"
          placeholder={placeholder}
        />
      </div>
    </>
  );
}
