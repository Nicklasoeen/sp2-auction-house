/**
 * wrapper around localStorage for the auth session
 */

import type { UserProfile } from "../api/auth";

const ACCESS_TOKEN_KEY = "rekit_access_token";
const API_KEY_KEY = "rekit_api_key";
const USER_PROFILE_KEY = "rekit_user_profile";

export function saveAccessToken(token: string): void {
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
}

export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function saveApiKey(apiKey: string): void {
  localStorage.setItem(API_KEY_KEY, apiKey);
}

export function getApiKey(): string | null {
  return localStorage.getItem(API_KEY_KEY);
}

export function saveUserProfile(profile: UserProfile): void {
  localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));
}

export function getUserProfile(): UserProfile | null {
  const raw = localStorage.getItem(USER_PROFILE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as UserProfile;
  } catch {
    return null;
  }
}

export function isLoggedIn(): boolean {
  return Boolean(getAccessToken() && getApiKey());
}

/** clears auth session */
export function clearAuthSession(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(API_KEY_KEY);
  localStorage.removeItem(USER_PROFILE_KEY);
}
