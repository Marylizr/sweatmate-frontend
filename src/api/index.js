// src/index.js
import { getUserToken } from "./auth";

/**
 * Base API URL:
 * - On production (Netlify at sweatmateapp.netlify.app), use the env var.
 * - Otherwise (local dev), fall back to localhost.
 */
export const API_URL =
  window.location.hostname === "sweatmateapp.netlify.app"
    ? process.env.REACT_APP_API_URL
    : "http://localhost:3001";

/**
 * Custom error for API responses.
 */
class ApiError extends Error {
  constructor(status, data) {
    super(`API request failed with status ${status}`);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

/**
 * Error to signal unauthorized (401) responses.
 */
export class UnauthorizedError extends Error {
  constructor() {
    super("Unauthorized");
    this.name = "UnauthorizedError";
  }
}

/**
 * fetchResource: wraps fetch() to:
 * - Attach bearer token
 * - Handle JSON body/stringification
 * - Normalize errors (network, HTTP, JSON)
 * - Refresh token if returned
 *
 * @param {string} method HTTP method
 * @param {string} path   Path relative to API_URL
 * @param {object} options fetch options (body, headers, etc.)
 */
const fetchResource = async (method = "GET", path, options = {}) => {
  const url = `${API_URL}/${path.replace(/^\/+/, "")}`;

  // Build headers
  const token = getUserToken();
  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  // Merge config
  const config = {
    method,
    ...options,
    headers,
  };

  // Stringify JSON body if needed
  if (
    config.body &&
    typeof config.body === "object" &&
    !(config.body instanceof FormData)
  ) {
    config.body = JSON.stringify(config.body);
  }

  let response;
  try {
    response = await fetch(url, config);
  } catch (err) {
    throw new ApiError("NETWORK_ERROR", { message: err.message });
  }

  // Handle 401 Unauthorized
  if (response.status === 401) {
    localStorage.removeItem("token");
    throw new UnauthorizedError();
  }

  // Attempt JSON parse (might be empty)
  let data = null;
  try {
    data = await response.json();
  } catch {
    /* no JSON */
  }

  // HTTP errors
  if (!response.ok) {
    throw new ApiError(response.status, data);
  }

  // Auto-refresh token if provided
  if (data && data.token) {
    localStorage.setItem("token", data.token);
  }

  return data;
};

export default fetchResource;
