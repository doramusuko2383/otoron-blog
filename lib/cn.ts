type ClassValue =
  | string
  | number
  | null
  | undefined
  | false
  | ClassValue[]
  | Record<string, any>;

export function cn(...inputs: ClassValue[]): string {
  const out: string[] = [];

  const push = (x: ClassValue) => {
    if (!x) return;
    if (typeof x === "string" || typeof x === "number") {
      out.push(String(x));
    } else if (Array.isArray(x)) {
      for (const v of x) push(v);
    } else if (typeof x === "object") {
      for (const k in x) {
        if (Object.prototype.hasOwnProperty.call(x, k) && x[k]) out.push(k);
      }
    }
  };

  for (const i of inputs) push(i);
  return out.join(" ");
}
