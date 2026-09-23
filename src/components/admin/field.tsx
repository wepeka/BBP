export function Field({
  label,
  name,
  type = "text",
  defaultValue,
  required,
  placeholder,
  min,
  hint,
}: {
  label: string;
  name: string;
  type?: string;
  defaultValue?: string | number;
  required?: boolean;
  placeholder?: string;
  min?: number;
  hint?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="text-[13.5px] font-medium text-[var(--color-ink)]">
        {label} {required && <span className="text-[var(--color-red)]">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        min={min}
        required={required}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="mt-1.5 w-full rounded-md border border-[var(--color-line-2)] bg-[var(--color-surface)] px-3.5 py-2.5 text-[14px] text-[var(--color-ink)]"
      />
      {hint && <p className="mt-1 text-[12px] text-[var(--color-ink-3)]">{hint}</p>}
    </div>
  );
}

export function TextAreaField({
  label,
  name,
  defaultValue,
  required,
  rows = 4,
  hint,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  required?: boolean;
  rows?: number;
  hint?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="text-[13.5px] font-medium text-[var(--color-ink)]">
        {label} {required && <span className="text-[var(--color-red)]">*</span>}
      </label>
      <textarea
        id={name}
        name={name}
        rows={rows}
        required={required}
        defaultValue={defaultValue}
        className="mt-1.5 w-full resize-y rounded-md border border-[var(--color-line-2)] bg-[var(--color-surface)] px-3.5 py-2.5 text-[14px] text-[var(--color-ink)]"
      />
      {hint && <p className="mt-1 text-[12px] text-[var(--color-ink-3)]">{hint}</p>}
    </div>
  );
}

export function SelectField({
  label,
  name,
  defaultValue,
  required,
  options,
  hint,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  required?: boolean;
  options: { value: string; label: string }[];
  hint?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="text-[13.5px] font-medium text-[var(--color-ink)]">
        {label} {required && <span className="text-[var(--color-red)]">*</span>}
      </label>
      <select
        id={name}
        name={name}
        required={required}
        defaultValue={defaultValue}
        className="mt-1.5 w-full rounded-md border border-[var(--color-line-2)] bg-[var(--color-surface)] px-3.5 py-2.5 text-[14px] text-[var(--color-ink)]"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {hint && <p className="mt-1 text-[12px] text-[var(--color-ink-3)]">{hint}</p>}
    </div>
  );
}

export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-md border border-[var(--color-line)] bg-[var(--color-surface)] p-6 ${className}`}>
      {children}
    </div>
  );
}

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-extrabold text-[var(--color-ink)]">{title}</h1>
        {description && <p className="mt-1 text-[14px] text-[var(--color-ink-2)]">{description}</p>}
      </div>
      {action}
    </div>
  );
}
