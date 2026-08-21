/**
 * Noroff API v2 authentication calls (register, login, create-api-key)
 */

const API_BASE_URL = "https://v2.api.noroff.dev";

export interface NoroffApiError {
  message: string;
}

export interface NoroffErrorResponse {
  errors: NoroffApiError[];
  status?: string;
  statusCode?: number;
}

/** thrown for any failed API call so callers can show a friendly message */
export class ApiError extends Error {
  statusCode?: number;

  constructor(message: string, statusCode?: number) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
  }
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface UserProfile {
  name: string;
  email: string;
  bio?: string;
  avatar?: { url: string; alt: string };
  banner?: { url: string; alt: string };
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResult extends UserProfile {
  accessToken: string;
}

interface NoroffDataResponse<T> {
  data: T;
}

/** Reads the API's error format and throws a single readable ApiError. */
async function parseErrorResponse(response: Response): Promise<never> {
  let message = `Request failed with status ${response.status}`;

  try {
    const body: NoroffErrorResponse = await response.json();
    if (body.errors?.length) {
      message = body.errors.map((e) => e.message).join(" ");
    }
  } catch {
    // Response had no JSON body; fall back to the default message above
  }

  throw new ApiError(message, response.status);
}

/** registers a new user */
export async function registerUser(
  payload: RegisterPayload,
): Promise<UserProfile> {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    await parseErrorResponse(response);
  }

  const { data }: NoroffDataResponse<UserProfile> = await response.json();
  return data;
}

/** logs a user in and returns their profile plus a JWT access token */
export async function loginUser(payload: LoginPayload): Promise<LoginResult> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    await parseErrorResponse(response);
  }

  const { data }: NoroffDataResponse<LoginResult> = await response.json();
  return data;
}

/** creates an API key for the logged-in user */
export async function createApiKey(accessToken: string): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/auth/create-api-key`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    await parseErrorResponse(response);
  }

  const { data }: NoroffDataResponse<{ apiKey: string }> =
    await response.json();
  return data.apiKey;
}
