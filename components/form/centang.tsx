import type { ComponentProps, ReactNode } from "react";

/** Checkbox dengan label & keterangan di sampingnya. Nilai terkirim "on" bila dicentang. */

type Props = Omit<ComponentProps<"input">, "type"> & {
  name: string;
  label: string;
  keterangan?: ReactNode;
};

export function Centang({ name, label, keterangan, id = name, ...props }: Props) {
  return (
    <div className="flex gap-3">
      <input
        id={id}
        name={name}
        type="checkbox"
        className="mt-0.5 size-5 shrink-0 accent-brand"
        aria-describedby={keterangan ? `${id}-keterangan` : undefined}
        {...props}
      />
      <div>
        <label htmlFor={id} className="text-sm font-medium">
          {label}
        </label>
        {keterangan && (
          <p id={`${id}-keterangan`} className="text-xs text-muted">
            {keterangan}
          </p>
        )}
      </div>
    </div>
  );
}
