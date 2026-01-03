// src/lib/api.ts

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL;
const API_TOKEN = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN_READ;

export async function fetchFromStrapi(endpoint: string) {
  const res = await fetch(`${STRAPI_URL}/api/${endpoint}`, {
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
    },
  });

  if (!res.ok) {
    console.error(
      `❌ Strapi API error [URL: ${STRAPI_URL}/api/${endpoint}]:`,
      res.status,
      res.statusText,
    );
    throw new Error(`Strapi API request failed with status ${res.status}`);
  }

  return await res.json();
}
