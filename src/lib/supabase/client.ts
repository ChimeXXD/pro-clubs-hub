// A small Supabase client (D-96, D-99): plain fetch against Supabase's PostgREST API, no supabase-js. It reads
// rows, calls database functions and inserts rows with the public anon key; row-level security in the database
// decides what the key may do (docs/supabase-schema.sql). Configured at build time from NEXT_PUBLIC_SUPABASE_URL
// and NEXT_PUBLIC_SUPABASE_ANON_KEY (public by design: the anon key is meant for browsers); with either missing
// there is no client, and callers show their offline or sample state.
// Every failure is a SupabaseError with a kind: "http" (PostgREST answered with an error), "network" (no answer)
// or "timeout"; callers word the failure states Figma draws (D-100 (3)).

export interface SupabaseConfig {
  url: string;
  anonKey: string;
}

/** The client's settings, or null when either is missing or the URL isn't one. */
export function supabaseConfig(env: { url: string | undefined; anonKey: string | undefined }): SupabaseConfig | null {
  const url = env.url?.trim().replace(/\/+$/, "");
  const anonKey = env.anonKey?.trim();
  if (!url || !anonKey) return null;
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:" && parsed.hostname !== "127.0.0.1" && parsed.hostname !== "localhost") return null;
  } catch {
    return null;
  }
  return { url, anonKey };
}

/**
 * This site's settings. Next inlines NEXT_PUBLIC_ variables only where they are written out in full, so they are
 * read here by name.
 */
export const SUPABASE = supabaseConfig({
  url: process.env.NEXT_PUBLIC_SUPABASE_URL,
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
});

export class SupabaseError extends Error {
  readonly kind: "http" | "network" | "timeout";
  readonly status: number | null;
  /** PostgREST's or Postgres's error code, such as "42501" (row-level security) or "PGRST116". */
  readonly code: string | null;

  constructor(kind: SupabaseError["kind"], message: string, status: number | null = null, code: string | null = null) {
    super(message);
    this.name = "SupabaseError";
    this.kind = kind;
    this.status = status;
    this.code = code;
  }
}

const TIMEOUT_MS = 10_000;
const IDENTIFIER = /^[a-z_][a-z0-9_]*$/;

function headers(config: SupabaseConfig, extra: Record<string, string> = {}): Record<string, string> {
  return { apikey: config.anonKey, Authorization: `Bearer ${config.anonKey}`, Accept: "application/json", ...extra };
}

async function request(fetchImpl: typeof fetch, url: string, init: RequestInit): Promise<unknown> {
  let response: Response;
  try {
    response = await fetchImpl(url, { ...init, signal: AbortSignal.timeout(TIMEOUT_MS) });
  } catch (error) {
    const timedOut = error instanceof DOMException && (error.name === "TimeoutError" || error.name === "AbortError");
    throw new SupabaseError(timedOut ? "timeout" : "network", timedOut ? "Supabase took too long to answer" : "Couldn't reach Supabase");
  }
  const text = await response.text();
  let body: unknown = null;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = text;
  }
  if (!response.ok) {
    const error = typeof body === "object" && body !== null ? (body as { message?: unknown; code?: unknown }) : {};
    const message = typeof error.message === "string" ? error.message : `Supabase answered ${response.status}`;
    throw new SupabaseError("http", message, response.status, typeof error.code === "string" ? error.code : null);
  }
  return body;
}

function name(kind: "table" | "function", value: string) {
  if (!IDENTIFIER.test(value)) throw new Error(`${JSON.stringify(value)} is not a ${kind} name`);
  return value;
}

/**
 * Rows of a table or view. `filters` are PostgREST operators by column, such as { status: "eq.listed" }; `columns`
 * is the select list.
 */
export async function select<T = Record<string, unknown>>(
  config: SupabaseConfig,
  table: string,
  { filters = {}, columns = "*", limit }: { filters?: Record<string, string>; columns?: string; limit?: number },
  fetchImpl: typeof fetch = fetch,
): Promise<T[]> {
  const query = new URLSearchParams({ select: columns, ...filters });
  if (limit !== undefined) query.set("limit", String(limit));
  const body = await request(fetchImpl, `${config.url}/rest/v1/${name("table", table)}?${query}`, { method: "GET", headers: headers(config) });
  return Array.isArray(body) ? (body as T[]) : [];
}

/**
 * Calls a database function. GET for a read-only function (its arguments go in the query, so the answer can be
 * cached); POST, the default, sends them as JSON.
 */
export async function rpc<T = unknown>(
  config: SupabaseConfig,
  fn: string,
  args: Record<string, unknown>,
  { method = "POST" }: { method?: "GET" | "POST" },
  fetchImpl: typeof fetch = fetch,
): Promise<T> {
  const base = `${config.url}/rest/v1/rpc/${name("function", fn)}`;
  if (method === "GET") {
    const query = new URLSearchParams(Object.entries(args).map(([k, v]) => [k, String(v)]));
    return (await request(fetchImpl, `${base}?${query}`, { method: "GET", headers: headers(config) })) as T;
  }
  return (await request(fetchImpl, base, {
    method: "POST",
    headers: headers(config, { "Content-Type": "application/json" }),
    body: JSON.stringify(args),
  })) as T;
}

/**
 * Inserts one row. Row-level security usually lets the anon key insert but not read, so nothing comes back unless
 * `returning` asks for the row (which then needs a read policy too).
 */
export async function insert<T = Record<string, unknown>>(
  config: SupabaseConfig,
  table: string,
  row: Record<string, unknown>,
  { returning = false }: { returning?: boolean },
  fetchImpl: typeof fetch = fetch,
): Promise<T | null> {
  const body = await request(fetchImpl, `${config.url}/rest/v1/${name("table", table)}`, {
    method: "POST",
    headers: headers(config, { "Content-Type": "application/json", Prefer: returning ? "return=representation" : "return=minimal" }),
    body: JSON.stringify(row),
  });
  return returning && Array.isArray(body) ? ((body[0] as T) ?? null) : null;
}
