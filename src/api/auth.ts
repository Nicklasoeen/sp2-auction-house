/**
 * noroff API authentication client (register, login, create-api-key)
 */

const API_BASE_URL = "https://v2.api.noroff.dev";

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthUser {
  name: string;
  email: string;
  accessToken: string;
}

export interface ApiKeyResponse {
  data: {
    key: string;
  };
}

export interface ApiErrorResponse {
  errors: { message: string }[];
  status: string;
  statusCode: number;
}

interface NoroffDataResponse<T> {
  data: T;
}

/** parses the response, returns body or error */
async function handleApiResponse<T>(response: Response): Promise<T> {
  const body = await response.json();

  if (!response.ok) {
    const errorBody = body as ApiErrorResponse;
    const message = errorBody.errors?.[0]?.message ?? "Something went wrong";
    throw new Error(message);
  }

  return (body as NoroffDataResponse<T>).data;
}

export async function registerUser(
  payload: RegisterPayload,
): Promise<AuthUser> {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  return handleApiResponse<AuthUser>(response);
}

export async function loginUser(payload: LoginPayload): Promise<AuthUser> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  return handleApiResponse<AuthUser>(response);
}

export async function createApiKey(accessToken: string): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/auth/create-api-key`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const { key } = await handleApiResponse<ApiKeyResponse["data"]>(response);
  return key;
}
