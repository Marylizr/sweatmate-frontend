import { getUserToken, setUserSession, removeSession } from "./auth";

export const API_URL =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_API_URL
    : "http://localhost:3001";


// Custom API error class
class ApiError {
  constructor(message, data, status) {
    let response = null;
    let isObject = false;

    try {
      response = JSON.parse(data);
      isObject = true;
    } catch (e) {
      response = data;
    }

    this.response = response;
    this.message = message;
    this.status = status;
    this.toString = function () {
      return `${this.message}\nResponse:\n${
        isObject ? JSON.stringify(this.response, null, 2) : this.response
      }`;
    };
  }
}

// API wrapper function
const fetchResource = async (method = "GET", path, userOptions = {}) => {
  const defaultOptions = {
    mode: "cors",
    method,
  };

  let token = getUserToken();
  if (!token) {
    token = localStorage.getItem("token");
    console.warn("Token missing or expired. Fetching user data may fail.");
  }

  // Validate token if present
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (Date.now() >= payload.exp * 1000) {
        console.warn("Token expired. Clearing session and requiring re-authentication.");
        removeSession();
        return { authError: true };
      }
    } catch (error) {
      console.error("Error decoding token:", error);
      removeSession();
      return { authError: true };
    }
  }

  console.log(`Token being used for request: ${token ? "Exists" : "Missing"}`);

  const headers = {
    ...(token && { Authorization: `Bearer ${token}` }),
    "Cache-Control": "no-cache",
    Pragma: "no-cache",
    Expires: "0",
  };

  const isMultipart = userOptions.body instanceof FormData;
  if (!isMultipart) {
    headers["Content-Type"] = "application/json";
  }

  const options = {
    ...defaultOptions,
    ...userOptions,
    headers: {
      ...headers,
      ...userOptions.headers,
    },
  };

  console.log("Final Request Headers:", options.headers);

  const url = `${API_URL}/${path}`;

  if (!isMultipart && options.body && typeof options.body === "object") {
    options.body = JSON.stringify(options.body);
  }

  let response = null;

  try {
    response = await fetch(url, options);

    if (response.status === 401) {
      console.warn("Unauthorized request (401). Token might be expired or missing.");
      removeSession();
      return { authError: true };
    }

    const parsedResponse = await response.json();

    if (response.status < 200 || response.status >= 300) {
      throw new ApiError(
        `Request failed with status ${response.status}.`,
        parsedResponse,
        response.status
      );
    }

    if (parsedResponse.token) {
      setUserSession(parsedResponse.token, parsedResponse.role, parsedResponse.id, parsedResponse.name, parsedResponse.gender);
      console.log("Token refreshed and stored.");
    }

    return parsedResponse;
  } catch (error) {
    if (response) {
      throw new ApiError(
        `Request failed with status ${response.status}.`,
        error,
        response.status
      );
    } else {
      throw new ApiError(error.toString(), null, "REQUEST_FAILED");
    }
  }
};

export default fetchResource;
