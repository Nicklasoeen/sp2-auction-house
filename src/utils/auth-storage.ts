/**
 * wrapper around localStorage for the auth session
 */

const NAME_KEY = "rekit_name";
const EMAIL_KEY = "rekit_email";
const ACCESS_TOKEN_KEY = "rekit_accessToken";
const API_KEY_KEY = "rekit_apiKey";

export interface StoredAuth {
  name: string;
  email: string;
  accessToken: string;
  apiKey: string;
}

export function saveAuth(user: StoredAuth): void {
  localStorage.setItem(NAME_KEY, user.name);
  localStorage.setItem(EMAIL_KEY, user.email);
  localStorage.setItem(ACCESS_TOKEN_KEY, user.accessToken);
  localStorage.setItem(API_KEY_KEY, user.apiKey);
}

export function getAuth(): StoredAuth | null {
  const name = localStorage.getItem(NAME_KEY);
  const email = localStorage.getItem(EMAIL_KEY);
  const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
  const apiKey = localStorage.getItem(API_KEY_KEY);

  if (!name || !email || !accessToken || !apiKey) return null;

  return { name, email, accessToken, apiKey };
}

export function clearAuth(): void {
  localStorage.removeItem(NAME_KEY);
  localStorage.removeItem(EMAIL_KEY);
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(API_KEY_KEY);
}
