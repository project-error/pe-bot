import fetch from 'node-fetch';

export async function fetchUrl<T>(url: string): Promise<T> {
  const parse = await fetch(url);
  return ((await parse.json()) as unknown) as T;
}
