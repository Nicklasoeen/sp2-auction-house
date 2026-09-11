import type { Listing } from "./listings";

const API_BASE_URL = "https://v2.api.noroff.dev";

export interface Profile {
  name: string;
  email: string;
  bio: string;
  avatar: { url: string; alt: string };
  banner: { url: string; alt: string };
  credits: number;
  _count?: { listings: number; wins: number };
}

export interface ProfileBid {
  id: string;
  amount: number;
  created: string;
  listing?: {
    id: string;
    title: string;
    media: { url: string; alt: string }[];
    tags?: string[];
    bids?: { amount: number }[];
    endsAt: string;
  };
}

export interface ProfileUpdatePayload {
  bio: string;
  avatar?: { url: string; alt: string };
  banner?: { url: string; alt: string };
}

interface ApiErrorResponse {
  errors: { message: string }[];
}

async function handleApiResponse<T>(response: Response): Promise<T> {
  const body = await response.json();

  if (!response.ok) {
    const errorBody = body as ApiErrorResponse;
    const message = errorBody.errors?.[0]?.message ?? "Something went wrong";
    throw new Error(message);
  }

  return body as T;
}

function authHeaders(accessToken: string, apiKey: string): HeadersInit {
  return {
    Authorization: `Bearer ${accessToken}`,
    "X-Noroff-API-Key": apiKey,
  };
}

export async function getProfile(
  name: string,
  accessToken: string,
  apiKey: string,
): Promise<Profile> {
  const response = await fetch(
    `${API_BASE_URL}/auction/profiles/${encodeURIComponent(name)}?_listings=true`,
    { headers: authHeaders(accessToken, apiKey) },
  );
  const result = await handleApiResponse<{ data: Profile }>(response);

  return result.data;
}

export async function getProfileListings(
  name: string,
  accessToken: string,
  apiKey: string,
): Promise<Listing[]> {
  const response = await fetch(
    `${API_BASE_URL}/auction/profiles/${encodeURIComponent(name)}/listings?_bids=true`,
    { headers: authHeaders(accessToken, apiKey) },
  );
  const result = await handleApiResponse<{ data: Listing[] }>(response);

  return result.data;
}

export async function getProfileBids(
  name: string,
  accessToken: string,
  apiKey: string,
): Promise<ProfileBid[]> {
  const response = await fetch(
    `${API_BASE_URL}/auction/profiles/${encodeURIComponent(name)}/bids?_listings=true`,
    { headers: authHeaders(accessToken, apiKey) },
  );
  const result = await handleApiResponse<{ data: ProfileBid[] }>(response);

  return result.data;
}

export async function updateProfile(
  name: string,
  payload: ProfileUpdatePayload,
  accessToken: string,
  apiKey: string,
): Promise<Profile> {
  const response = await fetch(
    `${API_BASE_URL}/auction/profiles/${encodeURIComponent(name)}`,
    {
      method: "PUT",
      headers: {
        ...authHeaders(accessToken, apiKey),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    },
  );
  const result = await handleApiResponse<{ data: Profile }>(response);

  return result.data;
}
