export async function readJsonBody<T = unknown>(request: Request) {
  try {
    const data = (await request.json()) as T;

    return {
      ok: true as const,
      data
    };
  } catch {
    return {
      ok: false as const
    };
  }
}
