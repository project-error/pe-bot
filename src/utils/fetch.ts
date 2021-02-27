import fetch from 'node-fetch';

export async function fetchUrl(url: string) {
  const parse = await fetch(url);
  return parse.json();
}
