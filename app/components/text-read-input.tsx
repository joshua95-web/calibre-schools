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
        className="block text-sm font-semibold text-slate-900 "
      >
        {label}
      </label>
      <div className="mt-1">
        <input
          type="text"
          name={name}
          id={name}
          value={value}
          onChange={onChange}
          className="block w-full rounded-md border-indigo-300 focus:border-amber-500 bg-indigo-100 text-slate-500 sm:text-sm p-1"
          placeholder={placeholder}
        />
      </div>
    </>
  );
}
