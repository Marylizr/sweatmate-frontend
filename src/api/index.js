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
  // Define default options
  const defaultOptions = {
    mode: "cors",
    method,
  };

  // Retrieve token using getUserToken or fallback to localStorage
  let token = getUserToken();
  if (!token) {
    token = localStorage.getItem("token"); // Fallback to local storage
    console.warn("Token missing or expired. Fetching user data may fail.");
  } else {
    // Decode token and check expiration before using it
    const payload = JSON.parse(atob(token.split(".")[1]));
    const tokenExpired = Date.now() >= payload.exp * 1000;

    if (tokenExpired) {
      console.warn("Token expired. Clearing session and requiring re-authentication.");
      removeSession(); // Ensure the user is logged out properly
      return { authError: true }; // Signal to the app that re-authentication is needed
    }
  }

  console.log(`Token being used for request: ${token ? "Exists" : "Missing"}`);

  // Define default headers
  const headers = {
    ...(token && { Authorization: `Bearer ${token}` }),
    "Cache-Control": "no-cache", // Prevent browser from caching API responses
    Pragma: "no-cache",
    Expires: "0",
  };

  // Detect if request contains file uploads
  const isMultipart = userOptions.body instanceof FormData;
  if (!isMultipart) {
    headers["Content-Type"] = "application/json";
  }

  // Merge user-provided options with default options and headers
  const options = {
    ...defaultOptions,
    ...userOptions,
    headers: {
      ...headers,
      ...userOptions.headers,
    },
  };

  console.log("Final Request Headers:", options.headers);

  // Build the request URL
  const url = `${API_URL}/${path}`;

  // Convert JSON data to string format if not multipart/form-data
  if (!isMultipart && options.body && typeof options.body === "object") {
    options.body = JSON.stringify(options.body);
  }

  let response = null;

  try {
    response = await fetch(url, options);

    // Handle 401 Unauthorized responses
    if (response.status === 401) {
      console.warn("Unauthorized request (401). Token might be expired or missing.");
      removeSession(); // Clear session if unauthorized
      return { authError: true }; // Signal re-authentication is needed
    }

    // Convert response to JSON
    const parsedResponse = await response.json();

    // Handle non-2xx status codes
    if (response.status < 200 || response.status >= 300) {
      throw new ApiError(
        `Request failed with status ${response.status}.`,
        parsedResponse,
        response.status
      );
    }

    // Store token from response if available (for cases like token refresh)
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
