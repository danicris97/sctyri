import React from "react";

export type DetailValue =
  | React.ReactNode
  | string
  | number
  | Date
  | boolean
  | string[]
  | number[]
  | null
  | undefined;

export type DetailItem = {
  label: string;
  value?: DetailValue;
  render?: (normalized: string, item: DetailItem) => React.ReactNode;
  hideIfEmpty?: boolean;
  isDate?: boolean;
  isCuit?: boolean;
  isCurrency?: boolean;
  isBoolean?: boolean;
  trueText?: string;
  falseText?: string;
  isEmpty?: (v: DetailValue) => boolean;
  // Link support
  isLink?: boolean;          // si true, se renderiza <a>
  href?: string;             // href directo; si no se provee, usa el texto normalizado
  targetBlank?: boolean;     // default true → _blank + rel="noopener noreferrer"
};

export type SimpleDetailListProps = {
  items: DetailItem[];
  className?: string;
  ariaLabel?: string;
};

function isParsableDate(input: any): input is string | number | Date {
  if (input instanceof Date) return true;
  if (typeof input === "number") return true;
  if (typeof input !== "string") return false;
  const isoLike = /^(\d{4}-\d{2}-\d{2})([T\s].*)?$/;
  const slashDMY = /^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/;
  return isoLike.test(input) || slashDMY.test(input);
}

function toDate(input: string | number | Date): Date | null {
  try {
    if (input instanceof Date) return input;
    if (typeof input === "number") return new Date(input);
    const slashDMY = /^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/;
    const m = slashDMY.exec(String(input));
    if (m) {
      const d = parseInt(m[1], 10);
      const mo = parseInt(m[2], 10) - 1;
      const y = parseInt(m[3], 10);
      return new Date(y < 100 ? 2000 + y : y, mo, d);
    }
    const dt = new Date(input);
    return isNaN(dt.getTime()) ? null : dt;
  } catch {
    return null;
  }
}

function formatDDMMYYYY(date: Date): string {
  const d = date.getDate().toString().padStart(2, "0");
  const m = (date.getMonth() + 1).toString().padStart(2, "0");
  const y = date.getFullYear().toString();
  return `${d}/${m}/${y}`;
}

function formatCuit(cuit: string | number): string {
  const digits = String(cuit).replace(/\D/g, "");
  if (digits.length === 11) return `${digits.slice(0, 2)}-${digits.slice(2, 10)}-${digits.slice(10)}`;
  return String(cuit);
}

function formatCurrency(value: number | string): string {
  const num = typeof value === "number" ? value : Number(String(value).replace(/[^\d.-]/g, ""));
  if (!isFinite(num)) return String(value);
  return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(num);
}

function normalizeValue(item: DetailItem): string {
  const v = item.value;
  if (v === null || v === undefined) return "";

  if (Array.isArray(v)) return v.join(", ");

  if (item.isBoolean || typeof v === "boolean") {
    const trueText = item.trueText ?? "Verdadero";
    const falseText = item.falseText ?? "Falso";
    const val = typeof v === "boolean" ? v : Boolean(v);
    return val ? trueText : falseText;
  }

  if (item.isDate) {
    const dt = v instanceof Date ? v : isParsableDate(v) ? toDate(v as any) : null;
    return dt ? formatDDMMYYYY(dt) : String(v);
  }

  if (item.isCuit) return formatCuit(v as any);
  if (item.isCurrency) return formatCurrency(v as any);

  if (v instanceof Date) return formatDDMMYYYY(v);
  if (typeof v === "string" || typeof v === "number") return String(v);

  return "";
}

export function SimpleDetailList({ items, className = "", ariaLabel }: SimpleDetailListProps) {
  const rows = items.filter((item) => {
    if (!item.hideIfEmpty) return true;
    const customEmpty = item.isEmpty?.(item.value);
    if (customEmpty !== undefined) return !customEmpty;
    const v = item.value;
    if (v === null || v === undefined) return false;
    if (Array.isArray(v)) return v.length > 0;
    if (typeof v === "string") return v.trim().length > 0;
    return true;
  });

  return (
    <div className={`w-full ${className}`} aria-label={ariaLabel ?? "Detalle"}>
      {rows.map((item, idx) => {
        const text = normalizeValue(item);

        // contenido base
        let baseContent: React.ReactNode = item.render
          ? item.render(text, item)
          : (item.value instanceof Object && !(item.value instanceof Date) ? item.value : text);

        // link wrapper si aplica
        if (item.isLink) {
          const href = (item.href ?? text)?.toString() || "";
          const targetBlank = item.targetBlank !== false; // default true
          if (href) {
            baseContent = (
              <a
                href={href}
                target={targetBlank ? "_blank" : undefined}
                rel={targetBlank ? "noopener noreferrer" : undefined}
                className="underline underline-offset-4 hover:opacity-90 break-words"
              >
                {baseContent}
              </a>
            );
          }
        }

        return (
          <div key={idx} className="py-3">
            <div className="text-sm text-muted-foreground leading-none select-text">{item.label}</div>
            <div className="mt-1 text-base sm:text-lg font-semibold text-foreground break-words select-text">
              {baseContent || (baseContent === 0 ? 0 : "—")}
            </div>
            {idx < rows.length - 1 && <div className="mt-3 h-px w-full bg-border" />}
          </div>
        );
      })}
    </div>
  );
}

// Helper para mapear objetos simples
export type FieldMap = Array<{
  key: string;
  label: string;
  isDate?: boolean;
  isCuit?: boolean;
  isCurrency?: boolean;
  isBoolean?: boolean;
  trueText?: string;
  falseText?: string;
  isLink?: boolean;
  href?: string; // si querés pasar el href literal desde el mapping
  // Si necesitás construir el href basado en el valor u otros campos, usá transform en items
  hideIfEmpty?: boolean;
  transform?: (v: any, obj?: any) => DetailValue;
  hrefTransform?: (v: any, obj?: any) => string | undefined; // construir href dinámico
}>;

export function buildDetailItems<T extends Record<string, any>>(obj: T, map: FieldMap): DetailItem[] {
  return map.map(({ key, label, isDate, isCuit, isCurrency, isBoolean, trueText, falseText, isLink, href, hideIfEmpty, transform, hrefTransform }) => {
    const raw = (obj as any)?.[key];
    const value = transform ? transform(raw, obj) : raw;
    const computedHref = hrefTransform ? hrefTransform(raw, obj) : href;
    return { label, value, isDate, isCuit, isCurrency, isBoolean, trueText, falseText, isLink, href: computedHref, hideIfEmpty };
  });
}
