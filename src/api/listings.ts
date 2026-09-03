const API_BASE_URL = "https://v2.api.noroff.dev";

export interface Listing {
  id: string;
  title: string;
  description: string;
  media: { url: string; alt: string }[];
  tags: string[];
  created: string;
  updated: string;
  endsAt: string;
  _count?: { bids: number };
  seller?: { name: string; email: string };
}

export interface ListingsResponse {
  data: Listing[];
  meta: {
    isFirstPage: boolean;
    isLastPage: boolean;
    currentPage: number;
    previousPage: number | null;
    nextPage: number | null;
    pageCount: number;
    totalCount: number;
  };
}

export interface ListingOptions {
  limit?: number;
  page?: number;
  sort?: string;
  sortOrder?: "asc" | "desc";
  tag?: string;
  active?: boolean;
  _bids?: boolean;
  _seller?: boolean;
}

interface ApiErrorResponse {
  errors: { message: string }[];
}

// returns both data and pagination metadata
async function handleApiResponse<T>(response: Response): Promise<T> {
  const body = await response.json();

  if (!response.ok) {
    const errorBody = body as ApiErrorResponse;
    const message = errorBody.errors?.[0]?.message ?? "Something went wrong";
    throw new Error(message);
  }

  return body as T;
}

function buildQueryString(options: ListingOptions = {}): string {
  const params = new URLSearchParams();
  const values = {
    ...options,
    _bids: options._bids ?? true,
    _seller: options._seller ?? true,
  };

  for (const [key, value] of Object.entries(values)) {
    if (value !== undefined && value !== "") {
      params.set(key, String(value));
    }
  }

  return params.toString();
}

export async function getListings(
  options: ListingOptions = {},
): Promise<ListingsResponse> {
  const queryString = buildQueryString(options);
  const url = `${API_BASE_URL}/auction/listings${queryString ? `?${queryString}` : ""}`;
  const response = await fetch(url);

  return handleApiResponse<ListingsResponse>(response);
}

export async function searchListings(
  query: string,
  options: Pick<ListingOptions, "limit" | "page"> = {},
): Promise<ListingsResponse> {
  const params = new URLSearchParams({ q: query });

  if (options.limit !== undefined) {
    params.set("limit", String(options.limit));
  }

  if (options.page !== undefined) {
    params.set("page", String(options.page));
  }

  const response = await fetch(
    `${API_BASE_URL}/auction/listings/search?${params.toString()}`,
  );

  return handleApiResponse<ListingsResponse>(response);
}
